import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto.js';
import { publicUrlFor } from '../common/upload/multer-storage.js';

const ANNOUNCEMENTS_UPLOAD_SUBFOLDER = 'announcements';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
    private readonly poisService: PoisService,
  ) {}

  async create(
    poiId: string,
    dto: CreateAnnouncementDto,
    audioFile?: Express.Multer.File,
  ): Promise<Announcement> {
    if (!dto.body?.trim() && !audioFile) {
      throw new BadRequestException(
        'An announcement needs either text or a voice message',
      );
    }

    const poi = await this.poisService.findOne(poiId);
    const announcement = this.announcementsRepository.create({
      ...dto,
      poi,
      audioUrl: audioFile
        ? publicUrlFor(ANNOUNCEMENTS_UPLOAD_SUBFOLDER, audioFile.filename)
        : undefined,
    });
    return this.announcementsRepository.save(announcement);
  }

  findForPoi(poiId: string): Promise<Announcement[]> {
    return this.announcementsRepository.find({
      where: { poi: { id: poiId } },
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    poiId: string,
    id: string,
    dto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findOneForPoi(poiId, id);
    Object.assign(announcement, dto);
    return this.announcementsRepository.save(announcement);
  }

  async remove(poiId: string, id: string): Promise<void> {
    const announcement = await this.findOneForPoi(poiId, id);
    await this.announcementsRepository.remove(announcement);
  }

  private async findOneForPoi(poiId: string, id: string): Promise<Announcement> {
    const announcement = await this.announcementsRepository.findOne({
      where: { id, poi: { id: poiId } },
    });
    if (!announcement) {
      throw new NotFoundException(`Announcement ${id} not found`);
    }
    return announcement;
  }
}
