import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPoi } from './entities/user-poi.entity.js';
import { UserPoisService } from './user-pois.service.js';
import { UserPoisController } from './user-pois.controller.js';
import { UsersModule } from '../users/users.module.js';
import { PoisModule } from '../pois/pois.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserPoi]), UsersModule, PoisModule],
  controllers: [UserPoisController],
  providers: [UserPoisService],
  exports: [UserPoisService],
})
export class UserPoisModule {}
