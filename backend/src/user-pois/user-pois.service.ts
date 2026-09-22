import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPoi } from './entities/user-poi.entity.js';
import { UsersService } from '../users/users.service.js';
import { PoisService } from '../pois/pois.service.js';
import { JoinPoiDto } from './dto/join-poi.dto.js';
import { MemberRole } from '../common/enums/member-role.enum.js';
import type { Poi } from '../pois/entities/poi.entity.js';

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

  // The membership someone already has for the place behind a QR token —
  // what "join" should hand back when they're a member already.
  async findMembership(userId: string, qrCodeToken: string): Promise<UserPoi | null> {
    const poi = await this.poisService.findByQrCodeToken(qrCodeToken);
    return this.membershipRepository.findOne({
      where: { user: { id: userId }, poi: { id: poi.id } },
      relations: { poi: true },
    });
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

  // Used by the admin dashboard: which POIs can this user manage, and are
  // they allowed to manage this specific one?
  async findAdminPoisForUser(userId: string): Promise<Poi[]> {
    const memberships = await this.membershipRepository.find({
      where: { user: { id: userId }, role: MemberRole.ADMIN },
      relations: { poi: true },
    });
    return memberships.map((m) => m.poi);
  }

  async isAdminOfPoi(userId: string, poiId: string): Promise<boolean> {
    const membership = await this.membershipRepository.findOne({
      where: { user: { id: userId }, poi: { id: poiId }, role: MemberRole.ADMIN },
    });
    return membership !== null;
  }
}
