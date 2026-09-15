import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleActif } from './entities/module-actif.entity.js';
import { LieuxDeCulteService } from '../lieux-de-culte/lieux-de-culte.service.js';
import { CreateModuleActifDto } from './dto/create-module-actif.dto.js';
import { UpdateModuleActifDto } from './dto/update-module-actif.dto.js';

@Injectable()
export class ModulesActifsService {
  constructor(
    @InjectRepository(ModuleActif)
    private readonly moduleActifRepository: Repository<ModuleActif>,
    private readonly lieuxDeCulteService: LieuxDeCulteService,
  ) {}

  async activer(
    lieuDeCulteId: string,
    dto: CreateModuleActifDto,
  ): Promise<ModuleActif> {
    const lieuDeCulte = await this.lieuxDeCulteService.findOne(lieuDeCulteId);

    const existant = await this.moduleActifRepository.findOne({
      where: {
        lieuDeCulte: { id: lieuDeCulte.id },
        typeModule: dto.typeModule,
      },
    });
    if (existant) {
      throw new ConflictException(
        `Le module ${dto.typeModule} est déjà activé pour ce lieu de culte`,
      );
    }

    const moduleActif = this.moduleActifRepository.create({
      lieuDeCulte,
      typeModule: dto.typeModule,
      statut: dto.statut,
      dateExpiration: dto.dateExpiration ? new Date(dto.dateExpiration) : null,
    });
    return this.moduleActifRepository.save(moduleActif);
  }

  findModulesDuLieuDeCulte(lieuDeCulteId: string): Promise<ModuleActif[]> {
    return this.moduleActifRepository.find({
      where: { lieuDeCulte: { id: lieuDeCulteId } },
    });
  }

  async update(
    id: string,
    dto: UpdateModuleActifDto,
  ): Promise<ModuleActif | null> {
    await this.moduleActifRepository.update(id, {
      ...dto,
      dateExpiration: dto.dateExpiration
        ? new Date(dto.dateExpiration)
        : undefined,
    });
    return this.moduleActifRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.moduleActifRepository.delete(id);
  }
}
