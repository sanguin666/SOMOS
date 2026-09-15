import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { LieuDeCulte } from './entities/lieu-de-culte.entity.js';
import { CreateLieuDeCulteDto } from './dto/create-lieu-de-culte.dto.js';
import { UpdateLieuDeCulteDto } from './dto/update-lieu-de-culte.dto.js';

@Injectable()
export class LieuxDeCulteService {
  constructor(
    @InjectRepository(LieuDeCulte)
    private readonly lieuxDeCulteRepository: Repository<LieuDeCulte>,
  ) {}

  create(createLieuDeCulteDto: CreateLieuDeCulteDto): Promise<LieuDeCulte> {
    const lieuDeCulte = this.lieuxDeCulteRepository.create({
      ...createLieuDeCulteDto,
      // Jeton unique utilisé pour générer le QR code du flyer d'onboarding.
      qrCodeToken: randomUUID(),
    });
    return this.lieuxDeCulteRepository.save(lieuDeCulte);
  }

  findAll(): Promise<LieuDeCulte[]> {
    return this.lieuxDeCulteRepository.find();
  }

  async findOne(id: string): Promise<LieuDeCulte> {
    const lieuDeCulte = await this.lieuxDeCulteRepository.findOne({
      where: { id },
    });
    if (!lieuDeCulte) {
      throw new NotFoundException(`Lieu de culte ${id} introuvable`);
    }
    return lieuDeCulte;
  }

  async findByQrCodeToken(qrCodeToken: string): Promise<LieuDeCulte> {
    const lieuDeCulte = await this.lieuxDeCulteRepository.findOne({
      where: { qrCodeToken },
    });
    if (!lieuDeCulte) {
      throw new NotFoundException('QR code inconnu');
    }
    return lieuDeCulte;
  }

  async update(
    id: string,
    updateLieuDeCulteDto: UpdateLieuDeCulteDto,
  ): Promise<LieuDeCulte> {
    const lieuDeCulte = await this.findOne(id);
    Object.assign(lieuDeCulte, updateLieuDeCulteDto);
    return this.lieuxDeCulteRepository.save(lieuDeCulte);
  }

  async remove(id: string): Promise<void> {
    const lieuDeCulte = await this.findOne(id);
    await this.lieuxDeCulteRepository.remove(lieuDeCulte);
  }
}
