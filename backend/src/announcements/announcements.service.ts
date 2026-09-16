import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';

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
  ): Promise<Announcement> {
    const poi = await this.poisService.findOne(poiId);
    const announcement = this.announcementsRepository.create({
      ...dto,
      poi,
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
