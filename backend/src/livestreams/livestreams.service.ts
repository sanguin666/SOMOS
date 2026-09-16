import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livestream } from './entities/livestream.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateLivestreamDto } from './dto/create-livestream.dto.js';

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
}
