import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livestream } from './entities/livestream.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateLivestreamDto } from './dto/create-livestream.dto.js';
import { UpdateLivestreamDto } from './dto/update-livestream.dto.js';

@Injectable()
export class LivestreamsService {
  constructor(
    @InjectRepository(Livestream)
    private readonly livestreamsRepository: Repository<Livestream>,
    private readonly poisService: PoisService,
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
    return this.livestreamsRepository.save(livestream);
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
    Object.assign(livestream, dto, {
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : livestream.scheduledAt,
    });
    return this.livestreamsRepository.save(livestream);
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
