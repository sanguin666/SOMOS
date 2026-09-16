import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
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
}
