import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLieuDeCulte } from './entities/user-lieu-de-culte.entity.js';
import { UserLieuDeCulteService } from './user-lieu-de-culte.service.js';
import { UserLieuDeCulteController } from './user-lieu-de-culte.controller.js';
import { UsersModule } from '../users/users.module.js';
import { LieuxDeCulteModule } from '../lieux-de-culte/lieux-de-culte.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLieuDeCulte]),
    UsersModule,
    LieuxDeCulteModule,
  ],
  controllers: [UserLieuDeCulteController],
  providers: [UserLieuDeCulteService],
  exports: [UserLieuDeCulteService],
})
export class UserLieuDeCulteModule {}
