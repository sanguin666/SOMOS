import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livestream } from './entities/livestream.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateLivestreamDto } from './dto/create-livestream.dto.js';
import { UpdateLivestreamDto } from './dto/update-livestream.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { LivestreamStatus } from '../common/enums/livestream-status.enum.js';
import { text } from '../notifications/texts.js';

@Injectable()
export class LivestreamsService {
  constructor(
    @InjectRepository(Livestream)
    private readonly livestreamsRepository: Repository<Livestream>,
    private readonly poisService: PoisService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(
    poiId: string,
    dto: CreateLivestreamDto,
  ): Promise<Livestream> {
    const poi = await this.poisService.findOne(poiId);
    const livestream = this.livestreamsRepository.create({
      ...dto,
      poi,
      scheduledAt: new Date(dto.scheduledAt),
    });
    const saved = await this.livestreamsRepository.save(livestream);
    if (saved.status === LivestreamStatus.LIVE) this.announceLive(poi.name, poiId, saved);
    return saved;
  }

  findForPoi(poiId: string): Promise<Livestream[]> {
    return this.livestreamsRepository.find({
      where: { poi: { id: poiId } },
      order: { scheduledAt: 'DESC' },
    });
  }

  async update(
    poiId: string,
    id: string,
    dto: UpdateLivestreamDto,
  ): Promise<Livestream> {
    const livestream = await this.findOneForPoi(poiId, id);
    const wasLive = livestream.status === LivestreamStatus.LIVE;
    Object.assign(livestream, dto, {
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : livestream.scheduledAt,
    });
    const saved = await this.livestreamsRepository.save(livestream);
    if (!wasLive && saved.status === LivestreamStatus.LIVE) {
      const poi = await this.poisService.findOne(poiId);
      this.announceLive(poi.name, poiId, saved);
    }
    return saved;
  }

  // Going live is the moment to tell people, once: not on every edit of
  // a stream that is already on air.
  private announceLive(poiName: string, poiId: string, livestream: Livestream): void {
    this.notifications.fireAndForget(() =>
      this.notifications.notifyPoiMembers(poiId, 'live', (reader) => ({
        title: poiName,
        body: text(reader.language, 'live', { title: livestream.title }),
        data: { screen: 'livestream', id: livestream.id },
      })),
    );
  }

  async remove(poiId: string, id: string): Promise<void> {
    const livestream = await this.findOneForPoi(poiId, id);
    await this.livestreamsRepository.remove(livestream);
  }

  private async findOneForPoi(poiId: string, id: string): Promise<Livestream> {
    const livestream = await this.livestreamsRepository.findOne({
      where: { id, poi: { id: poiId } },
    });
    if (!livestream) {
      throw new NotFoundException(`Livestream ${id} not found`);
    }
    return livestream;
  }
}
