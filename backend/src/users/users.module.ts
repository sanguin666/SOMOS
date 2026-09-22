import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthGuardsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
