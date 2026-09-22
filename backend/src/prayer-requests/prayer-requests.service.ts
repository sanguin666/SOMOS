import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrayerRequest } from './entities/prayer-request.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class PrayerRequestsService {
  constructor(
    @InjectRepository(PrayerRequest)
    private readonly prayerRequestsRepository: Repository<PrayerRequest>,
    private readonly poisService: PoisService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    poiId: string,
    authorId: string,
    dto: CreatePrayerRequestDto,
  ): Promise<PrayerRequest> {
    const [poi, author] = await Promise.all([
      this.poisService.findOne(poiId),
      this.usersService.findOne(authorId),
    ]);
    const prayerRequest = this.prayerRequestsRepository.create({
      ...dto,
      poi,
      author: { id: author.id },
      // Someone signed in doesn't have to type their name again, but can
      // still override it — or leave both blank and stay anonymous, which
      // for a prayer request is a reasonable thing to want.
      authorName: dto.authorName ?? author.firstName,
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
