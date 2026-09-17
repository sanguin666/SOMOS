import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { Poi } from '../pois/entities/poi.entity.js';
import { UserPoi } from '../user-pois/entities/user-poi.entity.js';
import { ActiveModule } from '../active-modules/entities/active-module.entity.js';
import { Announcement } from '../announcements/entities/announcement.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { PrayerRequest } from '../prayer-requests/entities/prayer-request.entity.js';
import { Livestream } from '../livestreams/entities/livestream.entity.js';
import { CommunityPost } from '../community/entities/community-post.entity.js';
import { CommunityComment } from '../community/entities/community-comment.entity.js';
import { Donation } from '../donations/entities/donation.entity.js';

export function buildTypeOrmConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'mypeople'),
    password: configService.get<string>('DB_PASSWORD', 'mypeople'),
    database: configService.get<string>('DB_NAME', 'mypeople'),
    entities: [
      User,
      Poi,
      UserPoi,
      ActiveModule,
      Announcement,
      Event,
      PrayerRequest,
      Livestream,
      CommunityPost,
      CommunityComment,
      Donation,
    ],
    // Convenient for the local demo: tables are created/updated automatically.
    // Switch to real migrations before any production use.
    synchronize: configService.get<string>('NODE_ENV', 'development') !== 'production',
  };
}
