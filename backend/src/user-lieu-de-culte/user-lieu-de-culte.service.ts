import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLieuDeCulte } from './entities/user-lieu-de-culte.entity.js';
import { UsersService } from '../users/users.service.js';
import { LieuxDeCulteService } from '../lieux-de-culte/lieux-de-culte.service.js';
import { RattacherLieuDeCulteDto } from './dto/rattacher-lieu-de-culte.dto.js';

@Injectable()
export class UserLieuDeCulteService {
  constructor(
    @InjectRepository(UserLieuDeCulte)
    private readonly liaisonRepository: Repository<UserLieuDeCulte>,
    private readonly usersService: UsersService,
    private readonly lieuxDeCulteService: LieuxDeCulteService,
  ) {}

  async rattacher(
    userId: string,
    dto: RattacherLieuDeCulteDto,
  ): Promise<UserLieuDeCulte> {
    const user = await this.usersService.findOne(userId);
    const lieuDeCulte = await this.lieuxDeCulteService.findByQrCodeToken(
      dto.qrCodeToken,
    );

    const existant = await this.liaisonRepository.findOne({
      where: { user: { id: user.id }, lieuDeCulte: { id: lieuDeCulte.id } },
    });
    if (existant) {
      throw new ConflictException(
        'Cet utilisateur est déjà rattaché à ce lieu de culte',
      );
    }

    const liaison = this.liaisonRepository.create({ user, lieuDeCulte });
    return this.liaisonRepository.save(liaison);
  }

  findLieuxDeCulteDuUser(userId: string): Promise<UserLieuDeCulte[]> {
    return this.liaisonRepository.find({
      where: { user: { id: userId } },
      relations: { lieuDeCulte: true },
    });
  }

  findMembresDuLieuDeCulte(lieuDeCulteId: string): Promise<UserLieuDeCulte[]> {
    return this.liaisonRepository.find({
      where: { lieuDeCulte: { id: lieuDeCulteId } },
      relations: { user: true },
    });
  }

  async detacher(userId: string, lieuDeCulteId: string): Promise<void> {
    await this.liaisonRepository.delete({
      user: { id: userId },
      lieuDeCulte: { id: lieuDeCulteId },
    });
  }
}
