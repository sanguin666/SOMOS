import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PoiPageBlock } from './entities/poi-page-block.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreatePageBlockDto } from './dto/create-page-block.dto.js';
import { UpdatePageBlockDto } from './dto/update-page-block.dto.js';

@Injectable()
export class PoiPageService {
  constructor(
    @InjectRepository(PoiPageBlock)
    private readonly blocksRepository: Repository<PoiPageBlock>,
    private readonly poisService: PoisService,
  ) {}

  findForPoi(poiId: string): Promise<PoiPageBlock[]> {
    return this.blocksRepository.find({
      where: { poi: { id: poiId } },
      order: { position: 'ASC' },
    });
  }

  async create(poiId: string, dto: CreatePageBlockDto): Promise<PoiPageBlock> {
    const poi = await this.poisService.findOne(poiId);
    const existing = await this.findForPoi(poiId);
    const block = this.blocksRepository.create({
      ...dto,
      poi,
      position: existing.length,
    });
    return this.blocksRepository.save(block);
  }

  async update(poiId: string, id: string, dto: UpdatePageBlockDto): Promise<PoiPageBlock> {
    const block = await this.findOneForPoi(poiId, id);
    Object.assign(block, dto);
    return this.blocksRepository.save(block);
  }

  async remove(poiId: string, id: string): Promise<void> {
    const block = await this.findOneForPoi(poiId, id);
    await this.blocksRepository.remove(block);
    // Close the gap so positions stay 0..n-1 and a later insert doesn't
    // land on top of an existing block.
    const remaining = await this.findForPoi(poiId);
    await this.persistOrder(remaining);
  }

  /**
   * Rewrites every block's position from the given order. The list has to
   * name the POI's blocks exactly — a partial list would silently drop
   * whatever it left out to the end of the page.
   */
  async reorder(poiId: string, ids: string[]): Promise<PoiPageBlock[]> {
    const blocks = await this.blocksRepository.find({
      where: { id: In(ids), poi: { id: poiId } },
    });
    const total = await this.blocksRepository.count({ where: { poi: { id: poiId } } });
    if (blocks.length !== ids.length || blocks.length !== total) {
      throw new BadRequestException('Reorder must list every block of this POI exactly once');
    }

    const byId = new Map(blocks.map((block) => [block.id, block]));
    const ordered = ids.map((id) => byId.get(id)!);
    await this.persistOrder(ordered);
    return this.findForPoi(poiId);
  }

  private async persistOrder(ordered: PoiPageBlock[]): Promise<void> {
    ordered.forEach((block, index) => {
      block.position = index;
    });
    if (ordered.length > 0) {
      await this.blocksRepository.save(ordered);
    }
  }

  private async findOneForPoi(poiId: string, id: string): Promise<PoiPageBlock> {
    const block = await this.blocksRepository.findOne({
      where: { id, poi: { id: poiId } },
    });
    if (!block) {
      throw new NotFoundException(`Page block ${id} not found`);
    }
    return block;
  }
}
