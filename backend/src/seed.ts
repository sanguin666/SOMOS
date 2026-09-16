import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity.js';
import { Poi } from './pois/entities/poi.entity.js';
import { UserPoi } from './user-pois/entities/user-poi.entity.js';
import { ActiveModule } from './active-modules/entities/active-module.entity.js';
import { Announcement } from './announcements/entities/announcement.entity.js';
import { PrayerRequest } from './prayer-requests/entities/prayer-request.entity.js';
import { Livestream } from './livestreams/entities/livestream.entity.js';
import { ModuleType } from './common/enums/module-type.enum.js';
import { ModuleStatus } from './common/enums/module-status.enum.js';
import { LivestreamStatus } from './common/enums/livestream-status.enum.js';

/**
 * Seeds one demo POI with a fixed QR token, so the app has something real
 * to fetch without needing a working camera scanner or auth flow yet.
 * Safe to re-run: it only creates what's missing.
 */
const DEMO_QR_TOKEN = 'DEMO-STMARYS';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'mypeople',
  password: process.env.DB_PASSWORD ?? 'mypeople',
  database: process.env.DB_NAME ?? 'mypeople',
  entities: [User, Poi, UserPoi, ActiveModule, Announcement, PrayerRequest, Livestream],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const poiRepository = dataSource.getRepository(Poi);
  const activeModuleRepository = dataSource.getRepository(ActiveModule);
  const announcementRepository = dataSource.getRepository(Announcement);
  const prayerRequestRepository = dataSource.getRepository(PrayerRequest);
  const livestreamRepository = dataSource.getRepository(Livestream);

  let poi = await poiRepository.findOne({
    where: { qrCodeToken: DEMO_QR_TOKEN },
  });
  if (!poi) {
    poi = await poiRepository.save(
      poiRepository.create({
        name: "St. Mary's Parish",
        city: 'Springfield',
        qrCodeToken: DEMO_QR_TOKEN,
      }),
    );
    console.log(`Created demo POI ${poi.id}`);
  } else {
    console.log(`Demo POI already exists: ${poi.id}`);
  }

  for (const moduleType of [
    ModuleType.DONATIONS,
    ModuleType.EVENTS,
    ModuleType.ANNOUNCEMENTS,
    ModuleType.PRAYER_REQUESTS,
    ModuleType.LIVESTREAMS,
  ]) {
    const existing = await activeModuleRepository.findOne({
      where: { poi: { id: poi.id }, moduleType },
    });
    if (!existing) {
      await activeModuleRepository.save(
        activeModuleRepository.create({
          poi,
          moduleType,
          status: ModuleStatus.ACTIVE,
        }),
      );
      console.log(`Activated ${moduleType} for the demo POI`);
    }
  }

  const announcementCount = await announcementRepository.count({
    where: { poi: { id: poi.id } },
  });
  if (announcementCount === 0) {
    await announcementRepository.save([
      announcementRepository.create({
        poi,
        title: 'This week’s bulletin',
        body: "This week's readings, choir practice moves to Thursday evenings starting this month, and a reminder that the parish office will be closed on Monday for the holiday.",
      }),
      announcementRepository.create({
        poi,
        title: 'Food pantry donations needed',
        body: 'Our food pantry is running low on canned goods and pasta. Donations can be dropped off at the parish hall any weekday between 9am and 4pm.',
      }),
    ]);
    console.log('Seeded demo announcements');
  }

  const prayerRequestCount = await prayerRequestRepository.count({
    where: { poi: { id: poi.id } },
  });
  if (prayerRequestCount === 0) {
    await prayerRequestRepository.save([
      prayerRequestRepository.create({
        poi,
        authorName: 'Margaret',
        message: 'Please pray for my husband as he recovers from surgery this week.',
        prayerCount: 14,
      }),
      prayerRequestRepository.create({
        poi,
        message: 'For peace and strength for all families going through hard times right now.',
        prayerCount: 8,
      }),
      prayerRequestRepository.create({
        poi,
        authorName: 'Robert',
        message: 'In thanksgiving for a safe delivery of our new grandchild.',
        prayerCount: 21,
      }),
    ]);
    console.log('Seeded demo prayer requests');
  }

  const livestreamCount = await livestreamRepository.count({
    where: { poi: { id: poi.id } },
  });
  if (livestreamCount === 0) {
    const now = Date.now();
    const pastSunday = new Date(now - 5 * 24 * 60 * 60 * 1000);
    const nextSunday = new Date(now + 2 * 24 * 60 * 60 * 1000);
    const label = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    await livestreamRepository.save([
      livestreamRepository.create({
        poi,
        title: `Sunday Mass — ${label(pastSunday)}`,
        url: 'https://example.com/live/sunday-mass-past',
        scheduledAt: pastSunday,
        status: LivestreamStatus.ENDED,
      }),
      livestreamRepository.create({
        poi,
        title: `Sunday Mass — ${label(nextSunday)}`,
        url: 'https://example.com/live/sunday-mass-next',
        scheduledAt: nextSunday,
        status: LivestreamStatus.UPCOMING,
      }),
    ]);
    console.log('Seeded demo livestreams');
  }

  console.log('\nDemo POI ready:');
  console.log(`  id:       ${poi.id}`);
  console.log(`  QR token: ${poi.qrCodeToken}`);

  await dataSource.destroy();
}

await seed();
