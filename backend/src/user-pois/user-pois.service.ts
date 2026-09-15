import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPoi } from './entities/user-poi.entity.js';
import { UsersService } from '../users/users.service.js';
import { PoisService } from '../pois/pois.service.js';
import { JoinPoiDto } from './dto/join-poi.dto.js';

@Injectable()
export class UserPoisService {
  constructor(
    @InjectRepository(UserPoi)
    private readonly membershipRepository: Repository<UserPoi>,
    private readonly usersService: UsersService,
    private readonly poisService: PoisService,
  ) {}

  async join(userId: string, dto: JoinPoiDto): Promise<UserPoi> {
    const user = await this.usersService.findOne(userId);
    const poi = await this.poisService.findByQrCodeToken(dto.qrCodeToken);

    const existing = await this.membershipRepository.findOne({
      where: { user: { id: user.id }, poi: { id: poi.id } },
    });
    if (existing) {
      throw new ConflictException('This user already belongs to this POI');
    }

    const membership = this.membershipRepository.create({ user, poi });
    return this.membershipRepository.save(membership);
  }

  findPoisForUser(userId: string): Promise<UserPoi[]> {
    return this.membershipRepository.find({
      where: { user: { id: userId } },
      relations: { poi: true },
    });
  }

  findMembersOfPoi(poiId: string): Promise<UserPoi[]> {
    return this.membershipRepository.find({
      where: { poi: { id: poiId } },
      relations: { user: true },
    });
  }

  async leave(userId: string, poiId: string): Promise<void> {
    await this.membershipRepository.delete({
      user: { id: userId },
      poi: { id: poiId },
    });
  }
}
