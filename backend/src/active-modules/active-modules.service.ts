import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveModule } from './entities/active-module.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { ActivateModuleDto } from './dto/activate-module.dto.js';
import { UpdateActiveModuleDto } from './dto/update-active-module.dto.js';

@Injectable()
export class ActiveModulesService {
  constructor(
    @InjectRepository(ActiveModule)
    private readonly activeModuleRepository: Repository<ActiveModule>,
    private readonly poisService: PoisService,
  ) {}

  async activate(
    poiId: string,
    dto: ActivateModuleDto,
  ): Promise<ActiveModule> {
    const poi = await this.poisService.findOne(poiId);

    const existing = await this.activeModuleRepository.findOne({
      where: {
        poi: { id: poi.id },
        moduleType: dto.moduleType,
      },
    });
    if (existing) {
      throw new ConflictException(
        `Module ${dto.moduleType} is already active for this POI`,
      );
    }

    const activeModule = this.activeModuleRepository.create({
      poi,
      moduleType: dto.moduleType,
      status: dto.status,
      expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
    });
    return this.activeModuleRepository.save(activeModule);
  }

  findActiveModulesForPoi(poiId: string): Promise<ActiveModule[]> {
    return this.activeModuleRepository.find({
      where: { poi: { id: poiId } },
    });
  }

  async update(
    id: string,
    dto: UpdateActiveModuleDto,
  ): Promise<ActiveModule | null> {
    await this.activeModuleRepository.update(id, {
      ...dto,
      expirationDate: dto.expirationDate
        ? new Date(dto.expirationDate)
        : undefined,
    });
    return this.activeModuleRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.activeModuleRepository.delete(id);
  }
}
