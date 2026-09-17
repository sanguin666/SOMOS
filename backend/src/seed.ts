import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users/entities/user.entity.js';
import { Poi } from './pois/entities/poi.entity.js';
import { UserPoi } from './user-pois/entities/user-poi.entity.js';
import { ActiveModule } from './active-modules/entities/active-module.entity.js';
import { Announcement } from './announcements/entities/announcement.entity.js';
import { PrayerRequest } from './prayer-requests/entities/prayer-request.entity.js';
import { Livestream } from './livestreams/entities/livestream.entity.js';
import { CommunityPost } from './community/entities/community-post.entity.js';
import { CommunityComment } from './community/entities/community-comment.entity.js';
import { ModuleType } from './common/enums/module-type.enum.js';
import { ModuleStatus } from './common/enums/module-status.enum.js';
import { LivestreamStatus } from './common/enums/livestream-status.enum.js';
import { PoiType } from './common/enums/poi-type.enum.js';
import { MemberRole } from './common/enums/member-role.enum.js';

/**
 * Seeds two demo POIs with fixed QR tokens, so the app has something real
 * to fetch without needing a working camera scanner yet, and a demo admin
 * account (email/password) managing both — showing what the admin
 * dashboard looks like for someone responsible for several churches.
 * Safe to re-run: it only creates what's missing.
 */
const DEMO_QR_TOKEN = 'DEMO-STMARYS';
const DEMO_QR_TOKEN_2 = 'DEMO-HOLYTRINITY';
const DEMO_ADMIN_EMAIL = 'admin@stmarys.example';
const DEMO_ADMIN_PASSWORD = 'demo1234';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'mypeople',
  password: process.env.DB_PASSWORD ?? 'mypeople',
  database: process.env.DB_NAME ?? 'mypeople',
  entities: [
    User,
    Poi,
    UserPoi,
    ActiveModule,
    Announcement,
    PrayerRequest,
    Livestream,
    CommunityPost,
    CommunityComment,
  ],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const poiRepository = dataSource.getRepository(Poi);
  const userPoiRepository = dataSource.getRepository(UserPoi);
  const activeModuleRepository = dataSource.getRepository(ActiveModule);
  const announcementRepository = dataSource.getRepository(Announcement);
  const prayerRequestRepository = dataSource.getRepository(PrayerRequest);
  const livestreamRepository = dataSource.getRepository(Livestream);
  const communityPostRepository = dataSource.getRepository(CommunityPost);
  const communityCommentRepository = dataSource.getRepository(CommunityComment);

  async function activateAllModules(target: Poi) {
    for (const moduleType of [
      ModuleType.DONATIONS,
      ModuleType.EVENTS,
      ModuleType.ANNOUNCEMENTS,
      ModuleType.PRAYER_REQUESTS,
      ModuleType.LIVESTREAMS,
      ModuleType.COMMUNITY,
    ]) {
      const existing = await activeModuleRepository.findOne({
        where: { poi: { id: target.id }, moduleType },
      });
      if (!existing) {
        await activeModuleRepository.save(
          activeModuleRepository.create({
            poi: target,
            moduleType,
            status: ModuleStatus.ACTIVE,
          }),
        );
        console.log(`Activated ${moduleType} for ${target.name}`);
      }
    }
  }

  let poi = await poiRepository.findOne({
    where: { qrCodeToken: DEMO_QR_TOKEN },
  });
  if (!poi) {
    poi = await poiRepository.save(
      poiRepository.create({
        name: "St. Mary's Parish",
        type: PoiType.CHURCH,
        city: 'Springfield',
        qrCodeToken: DEMO_QR_TOKEN,
      }),
    );
    console.log(`Created demo POI ${poi.id}`);
  } else {
    console.log(`Demo POI already exists: ${poi.id}`);
  }
  await activateAllModules(poi);

  // A second POI under the same admin's responsibility, to demo the
  // admin dashboard's POI switcher for someone managing several churches.
  let poi2 = await poiRepository.findOne({
    where: { qrCodeToken: DEMO_QR_TOKEN_2 },
  });
  if (!poi2) {
    poi2 = await poiRepository.save(
      poiRepository.create({
        name: 'Holy Trinity Chapel',
        type: PoiType.CHURCH,
        city: 'Springfield',
        qrCodeToken: DEMO_QR_TOKEN_2,
      }),
    );
    console.log(`Created demo POI ${poi2.id}`);
  } else {
    console.log(`Demo POI already exists: ${poi2.id}`);
  }
  await activateAllModules(poi2);

  const poi2AnnouncementCount = await announcementRepository.count({
    where: { poi: { id: poi2.id } },
  });
  if (poi2AnnouncementCount === 0) {
    await announcementRepository.save(
      announcementRepository.create({
        poi: poi2,
        title: 'Welcome to Holy Trinity Chapel',
        body: 'This is a demo announcement for our second parish, used to show off the admin dashboard.',
      }),
    );
    console.log('Seeded demo announcement for Holy Trinity Chapel');
  }

  let adminUser = await userRepository.findOne({
    where: { email: DEMO_ADMIN_EMAIL },
  });
  if (!adminUser) {
    adminUser = await userRepository.save(
      userRepository.create({
        email: DEMO_ADMIN_EMAIL,
        passwordHash: await bcrypt.hash(DEMO_ADMIN_PASSWORD, 10),
        firstName: 'Demo',
        lastName: 'Admin',
      }),
    );
    console.log(`Created demo admin user ${adminUser.id}`);
  }

  for (const target of [poi, poi2]) {
    const existingMembership = await userPoiRepository.findOne({
      where: { user: { id: adminUser.id }, poi: { id: target.id } },
    });
    if (!existingMembership) {
      await userPoiRepository.save(
        userPoiRepository.create({
          user: adminUser,
          poi: target,
          role: MemberRole.ADMIN,
        }),
      );
      console.log(`Made demo admin an ADMIN of ${target.name}`);
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

  const communityPostCount = await communityPostRepository.count({
    where: { poi: { id: poi.id } },
  });
  if (communityPostCount === 0) {
    const [carpoolPost, potluckPost] = await communityPostRepository.save([
      communityPostRepository.create({
        poi,
        authorName: 'Linda',
        message: 'Does anyone have room for a carpool to the Saturday retreat? I can help with gas money!',
      }),
      communityPostRepository.create({
        poi,
        authorName: 'Tom',
        message: "Thank you all for the meals and cards during my recovery — this community means so much to us.",
      }),
    ]);

    await communityCommentRepository.save([
      communityCommentRepository.create({
        post: carpoolPost,
        authorName: 'Robert',
        message: 'I have two seats free, happy to pick you up on the way!',
      }),
      communityCommentRepository.create({
        post: carpoolPost,
        authorName: 'Margaret',
        message: 'Same here, I leave from the parish hall around 8am.',
      }),
      communityCommentRepository.create({
        post: potluckPost,
        authorName: 'Margaret',
        message: 'So glad to hear you are doing better, Tom!',
      }),
    ]);
    console.log('Seeded demo community posts');
  }

  console.log('\nDemo POI ready:');
  console.log(`  id:       ${poi.id}`);
  console.log(`  QR token: ${poi.qrCodeToken}`);
  console.log(`\nSecond demo POI: ${poi2.name} (QR token: ${poi2.qrCodeToken})`);
  console.log('\nDemo admin dashboard login:');
  console.log(`  email:    ${DEMO_ADMIN_EMAIL}`);
  console.log(`  password: ${DEMO_ADMIN_PASSWORD}`);

  await dataSource.destroy();
}

await seed();
