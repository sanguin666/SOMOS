import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { buildTypeOrmConfig } from './config/typeorm.config.js';
import { UsersModule } from './users/users.module.js';
import { LieuxDeCulteModule } from './lieux-de-culte/lieux-de-culte.module.js';
import { UserLieuDeCulteModule } from './user-lieu-de-culte/user-lieu-de-culte.module.js';
import { ModulesActifsModule } from './modules-actifs/modules-actifs.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: buildTypeOrmConfig,
    }),
    UsersModule,
    LieuxDeCulteModule,
    UserLieuDeCulteModule,
    ModulesActifsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
