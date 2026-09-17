import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrayerRequest } from './entities/prayer-request.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto.js';

@Injectable()
export class PrayerRequestsService {
  constructor(
    @InjectRepository(PrayerRequest)
    private readonly prayerRequestsRepository: Repository<PrayerRequest>,
    private readonly poisService: PoisService,
  ) {}

  async create(
    poiId: string,
    dto: CreatePrayerRequestDto,
  ): Promise<PrayerRequest> {
    const poi = await this.poisService.findOne(poiId);
    const prayerRequest = this.prayerRequestsRepository.create({
      ...dto,
      poi,
    });
    return this.prayerRequestsRepository.save(prayerRequest);
  }

  findForPoi(poiId: string): Promise<PrayerRequest[]> {
    return this.prayerRequestsRepository.find({
      where: { poi: { id: poiId } },
      order: { createdAt: 'DESC' },
    });
  }

  async pray(id: string): Promise<PrayerRequest> {
    const result = await this.prayerRequestsRepository.increment(
      { id },
      'prayerCount',
      1,
    );
    if (!result.affected) {
      throw new NotFoundException(`Prayer request ${id} not found`);
    }
    const updated = await this.prayerRequestsRepository.findOne({
      where: { id },
    });
    if (!updated) {
      throw new NotFoundException(`Prayer request ${id} not found`);
    }
    return updated;
  }

  async remove(poiId: string, id: string): Promise<void> {
    const prayerRequest = await this.prayerRequestsRepository.findOne({
      where: { id, poi: { id: poiId } },
    });
    if (!prayerRequest) {
      throw new NotFoundException(`Prayer request ${id} not found`);
    }
    await this.prayerRequestsRepository.remove(prayerRequest);
  }
}
