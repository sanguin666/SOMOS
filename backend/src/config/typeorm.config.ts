import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { LieuDeCulte } from '../lieux-de-culte/entities/lieu-de-culte.entity.js';
import { UserLieuDeCulte } from '../user-lieu-de-culte/entities/user-lieu-de-culte.entity.js';
import { ModuleActif } from '../modules-actifs/entities/module-actif.entity.js';

export function buildTypeOrmConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'mychurch'),
    password: configService.get<string>('DB_PASSWORD', 'mychurch'),
    database: configService.get<string>('DB_NAME', 'mychurch'),
    entities: [User, LieuDeCulte, UserLieuDeCulte, ModuleActif],
    // Pratique pour la démo locale : les tables sont créées/mises à jour automatiquement.
    // À désactiver au profit de vraies migrations avant tout usage en production.
    synchronize: configService.get<string>('NODE_ENV', 'development') !== 'production',
  };
}
