import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { buildTypeOrmConfig } from './config/typeorm.config.js';
import { UsersModule } from './users/users.module.js';
import { PoisModule } from './pois/pois.module.js';
import { UserPoisModule } from './user-pois/user-pois.module.js';
import { ActiveModulesModule } from './active-modules/active-modules.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: buildTypeOrmConfig,
    }),
    UsersModule,
    PoisModule,
    UserPoisModule,
    ActiveModulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
