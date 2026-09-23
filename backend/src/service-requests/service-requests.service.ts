import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { In, Not, Repository } from 'typeorm';
import { PoisService } from '../pois/pois.service.js';
import { User } from '../users/entities/user.entity.js';
import { SignedUrlService } from '../common/signed-url/signed-url.service.js';
import { PRIVATE_UPLOADS_ROOT } from '../common/upload/private-storage.js';
import { signedPrivateFileUrl } from '../private-files/private-files.controller.js';
import {
  ServiceRequest,
  ServiceRequestStatus,
  type ServiceRequestType,
} from './entities/service-request.entity.js';
import { ServiceRequestMessage } from './entities/service-request-message.entity.js';
import { ServiceRequestDocument } from './entities/service-request-document.entity.js';
import type {
  CreateServiceRequestDocumentDto,
  CreateServiceRequestDto,
  UpdateServiceRequestDto,
} from './dto/service-request.dto.js';

/** The folder under PRIVATE_UPLOADS_ROOT every request file goes in. */
export const REQUEST_FILES_FOLDER = 'requests';

/** Which side of a request is looking. Decided by the route, never guessed. */
export type Side = 'member' | 'staff';

export type FileView = { name: string; mime: string | null; url: string };

export type MessageView = {
  id: string;
  fromStaff: boolean;
  authorName: string | null;
  body: string | null;
  attachment: FileView | null;
  createdAt: Date;
};

export type DocumentView = {
  id: string;
  label: string;
  note: string | null;
  receivedAt: Date | null;
  file: FileView | null;
  createdAt: Date;
};

export type RequestSummary = {
  id: string;
  type: ServiceRequestType;
  status: ServiceRequestStatus;
  contactName: string;
  contactPhone: string | null;
  details: string;
  preferredDate: string | null;
  appointmentAt: Date | null;
  appointmentPlace: string | null;
  // Papers asked for and not yet in.
  documentsPending: number;
  // Something happened on the other side since this side last opened it.
  unread: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Staff only: who asked, so the office can call them back.
  requester?: { id: string; firstName: string | null; lastName: string | null; phone: string | null };
};

export type RequestDetail = RequestSummary & {
  messages: MessageView[];
  documents: DocumentView[];
};

type UploadedFile = { filename: string; originalname: string; mimetype: string };

// Requests that are over, which the member's list shows after the live
// ones and the dashboard hides behind its "closed" filter.
const CLOSED = [ServiceRequestStatus.COMPLETED, ServiceRequestStatus.CANCELLED];

@Injectable()
export class ServiceRequestsService {
  constructor(
    @InjectRepository(ServiceRequest)
    private readonly requests: Repository<ServiceRequest>,
    @InjectRepository(ServiceRequestMessage)
    private readonly messages: Repository<ServiceRequestMessage>,
    @InjectRepository(ServiceRequestDocument)
    private readonly documents: Repository<ServiceRequestDocument>,
    private readonly poisService: PoisService,
    private readonly signedUrls: SignedUrlService,
  ) {}

  async create(poiId: string, userId: string, dto: CreateServiceRequestDto): Promise<RequestDetail> {
    const poi = await this.poisService.findOne(poiId);
    const request = await this.requests.save(
      this.requests.create({
        ...dto,
        poi,
        requester: { id: userId } as User,
        lastMemberActivityAt: new Date(),
        memberSeenAt: new Date(),
      }),
    );
    return this.detail(request.id, 'member');
  }

  /** A member's own requests at this place, the ones still open first. */
  async listMine(poiId: string, userId: string): Promise<RequestSummary[]> {
    const rows = await this.requests.find({
      where: { poi: { id: poiId }, requester: { id: userId } },
      relations: { documents: true },
      order: { createdAt: 'DESC' },
    });
    const views = rows.map((row) => this.summary(row, 'member'));
    return [...views.filter((v) => !CLOSED.includes(v.status)), ...views.filter((v) => CLOSED.includes(v.status))];
  }

  /**
   * The office's list. `open` (the default) is everything still to deal
   * with; `closed` is what is done or cancelled.
   */
  async listForStaff(poiId: string, filter: 'open' | 'closed' | 'all' = 'open'): Promise<RequestSummary[]> {
    const status =
      filter === 'open' ? Not(In(CLOSED)) : filter === 'closed' ? In(CLOSED) : undefined;
    const rows = await this.requests.find({
      where: { poi: { id: poiId }, ...(status ? { status } : {}) },
      relations: { documents: true, requester: true },
      order: { updatedAt: 'DESC' },
    });
    return rows.map((row) => this.summary(row, 'staff'));
  }

  /** Opens a request for one side, and marks it read for that side. */
  async open(poiId: string, id: string, side: Side, userId: string): Promise<RequestDetail> {
    const request = await this.findFor(poiId, id, side, userId);
    await this.requests.update(
      request.id,
      side === 'member' ? { memberSeenAt: new Date() } : { staffSeenAt: new Date() },
    );
    return this.detail(request.id, side);
  }

  async updateByStaff(poiId: string, id: string, dto: UpdateServiceRequestDto): Promise<RequestDetail> {
    const request = await this.findFor(poiId, id, 'staff');
    if (dto.status !== undefined) request.status = dto.status;
    if (dto.appointmentAt !== undefined) {
      request.appointmentAt = dto.appointmentAt ? new Date(dto.appointmentAt) : null;
      // Setting a date is setting an appointment: say so without making
      // staff change the status by hand as well.
      if (request.appointmentAt && dto.status === undefined && !CLOSED.includes(request.status)) {
        request.status = ServiceRequestStatus.APPOINTMENT_SET;
      }
    }
    if (dto.appointmentPlace !== undefined) request.appointmentPlace = dto.appointmentPlace;
    request.lastStaffActivityAt = new Date();
    request.staffSeenAt = new Date();
    await this.requests.save(request);
    return this.detail(request.id, 'staff');
  }

  /** The member changing their mind. Staff close requests with a status. */
  async cancelByMember(poiId: string, id: string, userId: string): Promise<RequestDetail> {
    const request = await this.findFor(poiId, id, 'member', userId);
    if (CLOSED.includes(request.status)) {
      throw new BadRequestException('This request is already closed');
    }
    request.status = ServiceRequestStatus.CANCELLED;
    request.lastMemberActivityAt = new Date();
    await this.requests.save(request);
    return this.detail(request.id, 'member');
  }

  async addMessage(
    poiId: string,
    id: string,
    side: Side,
    userId: string,
    body: string | null | undefined,
    file: UploadedFile | undefined,
  ): Promise<RequestDetail> {
    const request = await this.findFor(poiId, id, side, userId);
    if (!body && !file) {
      throw new BadRequestException('Write a message or attach a file');
    }
    await this.messages.save(
      this.messages.create({
        request,
        author: { id: userId } as User,
        fromStaff: side === 'staff',
        body: body ?? null,
        ...(file ? this.storedFile(file, 'attachment') : {}),
      }),
    );
    await this.touch(request, side);
    return this.detail(request.id, side);
  }

  async requestDocument(poiId: string, id: string, dto: CreateServiceRequestDocumentDto): Promise<RequestDetail> {
    const request = await this.findFor(poiId, id, 'staff');
    await this.documents.save(this.documents.create({ ...dto, request }));
    await this.touch(request, 'staff');
    return this.detail(request.id, 'staff');
  }

  /** The member sending the file for a paper staff asked for. */
  async attachDocumentFile(
    poiId: string,
    id: string,
    documentId: string,
    userId: string,
    file: UploadedFile,
  ): Promise<RequestDetail> {
    const request = await this.findFor(poiId, id, 'member', userId);
    const document = await this.findDocument(request.id, documentId);
    // Sending again replaces the earlier file (a blurry photo, the wrong page).
    await this.deleteStoredFile(document.filePath);
    Object.assign(document, this.storedFile(file, 'file'), { receivedAt: new Date() });
    await this.documents.save(document);
    await this.touch(request, 'member');
    return this.detail(request.id, 'member');
  }

  async setDocumentReceived(poiId: string, id: string, documentId: string, received: boolean): Promise<RequestDetail> {
    const request = await this.findFor(poiId, id, 'staff');
    const document = await this.findDocument(request.id, documentId);
    document.receivedAt = received ? (document.receivedAt ?? new Date()) : null;
    await this.documents.save(document);
    await this.touch(request, 'staff');
    return this.detail(request.id, 'staff');
  }

  async removeDocument(poiId: string, id: string, documentId: string): Promise<RequestDetail> {
    const request = await this.findFor(poiId, id, 'staff');
    const document = await this.findDocument(request.id, documentId);
    await this.documents.remove(document);
    await this.deleteStoredFile(document.filePath);
    return this.detail(request.id, 'staff');
  }

  /**
   * The request, if this side may see it: staff of the place (the route's
   * admin guard has checked that already) or the member who asked. Anyone
   * else gets a 404 rather than a 403, so ids can't be probed.
   */
  private async findFor(poiId: string, id: string, side: Side, userId?: string): Promise<ServiceRequest> {
    const request = await this.requests.findOne({
      where: { id, poi: { id: poiId } },
      relations: { requester: true },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (side === 'member' && request.requester.id !== userId) {
      throw new NotFoundException('Request not found');
    }
    return request;
  }

  private async findDocument(requestId: string, documentId: string): Promise<ServiceRequestDocument> {
    const document = await this.documents.findOne({
      where: { id: documentId, request: { id: requestId } },
    });
    if (!document) throw new NotFoundException('Document not found');
    return document;
  }

  private async touch(request: ServiceRequest, side: Side): Promise<void> {
    const now = new Date();
    await this.requests.update(
      request.id,
      side === 'member'
        ? { lastMemberActivityAt: now, memberSeenAt: now }
        : { lastStaffActivityAt: now, staffSeenAt: now },
    );
  }

  private storedFile(file: UploadedFile, prefix: 'attachment' | 'file') {
    return {
      [`${prefix}Path`]: `${REQUEST_FILES_FOLDER}/${file.filename}`,
      [`${prefix}Name`]: file.originalname,
      [`${prefix}Mime`]: file.mimetype,
    };
  }

  private async deleteStoredFile(path: string | null | undefined): Promise<void> {
    if (!path) return;
    // Best effort: a file already gone is not worth failing the request over.
    await unlink(join(PRIVATE_UPLOADS_ROOT, path)).catch(() => undefined);
  }

  private fileView(path: string | null | undefined, name: string | null | undefined, mime: string | null | undefined): FileView | null {
    if (!path) return null;
    return {
      name: name ?? 'document',
      mime: mime ?? null,
      url: signedPrivateFileUrl(this.signedUrls, path, name),
    };
  }

  private summary(row: ServiceRequest, side: Side): RequestSummary {
    const otherSide = side === 'member' ? row.lastStaffActivityAt : row.lastMemberActivityAt;
    const seen = side === 'member' ? row.memberSeenAt : row.staffSeenAt;
    const view: RequestSummary = {
      id: row.id,
      type: row.type,
      status: row.status,
      contactName: row.contactName,
      contactPhone: row.contactPhone ?? null,
      details: row.details,
      preferredDate: row.preferredDate ?? null,
      appointmentAt: row.appointmentAt ?? null,
      appointmentPlace: row.appointmentPlace ?? null,
      documentsPending: (row.documents ?? []).filter((d) => !d.receivedAt).length,
      unread: !!otherSide && (!seen || otherSide > seen),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
    if (side === 'staff' && row.requester) {
      view.requester = {
        id: row.requester.id,
        firstName: row.requester.firstName ?? null,
        lastName: row.requester.lastName ?? null,
        phone: row.requester.phone ?? null,
      };
    }
    return view;
  }

  private async detail(id: string, side: Side): Promise<RequestDetail> {
    const row = await this.requests.findOneOrFail({
      where: { id },
      relations: { requester: true, documents: true, messages: { author: true } },
      order: { messages: { createdAt: 'ASC' }, documents: { createdAt: 'ASC' } },
    });
    return {
      ...this.summary(row, side),
      messages: row.messages.map((message) => ({
        id: message.id,
        fromStaff: message.fromStaff,
        authorName: message.author
          ? [message.author.firstName, message.author.lastName].filter(Boolean).join(' ') || null
          : null,
        body: message.body ?? null,
        attachment: this.fileView(message.attachmentPath, message.attachmentName, message.attachmentMime),
        createdAt: message.createdAt,
      })),
      documents: row.documents.map((document) => ({
        id: document.id,
        label: document.label,
        note: document.note ?? null,
        receivedAt: document.receivedAt ?? null,
        file: this.fileView(document.filePath, document.fileName, document.fileMime),
        createdAt: document.createdAt,
      })),
    };
  }
}
