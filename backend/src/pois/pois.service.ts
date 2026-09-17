import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Poi } from './entities/poi.entity.js';
import { CreatePoiDto } from './dto/create-poi.dto.js';
import { UpdatePoiDto } from './dto/update-poi.dto.js';

@Injectable()
export class PoisService {
  constructor(
    @InjectRepository(Poi)
    private readonly poisRepository: Repository<Poi>,
  ) {}

  create(createPoiDto: CreatePoiDto): Promise<Poi> {
    const poi = this.poisRepository.create({
      ...createPoiDto,
      // Unique token used to generate the onboarding flyer's QR code.
      qrCodeToken: randomUUID(),
    });
    return this.poisRepository.save(poi);
  }

  findAll(): Promise<Poi[]> {
    return this.poisRepository.find();
  }

  async findOne(id: string): Promise<Poi> {
    const poi = await this.poisRepository.findOne({ where: { id } });
    if (!poi) {
      throw new NotFoundException(`POI ${id} not found`);
    }
    return poi;
  }

  async findByQrCodeToken(qrCodeToken: string): Promise<Poi> {
    const poi = await this.poisRepository.findOne({
      where: { qrCodeToken },
    });
    if (!poi) {
      throw new NotFoundException('Unknown QR code');
    }
    return poi;
  }

  // Accepts any partial update to the entity's own fields — not just
  // UpdatePoiDto — so the separate admin-gated endpoints in
  // PoiSettingsController (language, profile) can reuse this too.
  async update(id: string, updatePoiDto: UpdatePoiDto | Partial<Poi>): Promise<Poi> {
    const poi = await this.findOne(id);
    Object.assign(poi, updatePoiDto);
    return this.poisRepository.save(poi);
  }

  async remove(id: string): Promise<void> {
    const poi = await this.findOne(id);
    await this.poisRepository.remove(poi);
  }
}
