import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    private readonly poisService: PoisService,
  ) {}

  async create(poiId: string, dto: CreateEventDto): Promise<Event> {
    const poi = await this.poisService.findOne(poiId);
    const event = this.eventsRepository.create({
      ...dto,
      startsAt: new Date(dto.startsAt),
      endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      repeatUntil: dto.repeatUntil ? new Date(dto.repeatUntil) : null,
      poi,
    });
    return this.eventsRepository.save(event);
  }

  findForPoi(poiId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { poi: { id: poiId } },
      order: { startsAt: 'ASC' },
    });
  }

  async update(poiId: string, id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findOneForPoi(poiId, id);
    Object.assign(event, {
      ...dto,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : event.startsAt,
      endsAt: dto.endsAt === undefined ? event.endsAt : dto.endsAt ? new Date(dto.endsAt) : null,
      repeatUntil:
        dto.repeatUntil === undefined
          ? event.repeatUntil
          : dto.repeatUntil
            ? new Date(dto.repeatUntil)
            : null,
    });
    return this.eventsRepository.save(event);
  }

  async remove(poiId: string, id: string): Promise<void> {
    const event = await this.findOneForPoi(poiId, id);
    await this.eventsRepository.remove(event);
  }

  private async findOneForPoi(poiId: string, id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id, poi: { id: poiId } },
    });
    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }
    return event;
  }
}
