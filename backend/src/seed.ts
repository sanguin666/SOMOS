import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users/entities/user.entity.js';
import { Poi } from './pois/entities/poi.entity.js';
import { UserPoi } from './user-pois/entities/user-poi.entity.js';
import { ActiveModule } from './active-modules/entities/active-module.entity.js';
import { Announcement } from './announcements/entities/announcement.entity.js';
import { Event } from './events/entities/event.entity.js';
import { PrayerRequest } from './prayer-requests/entities/prayer-request.entity.js';
import { Livestream } from './livestreams/entities/livestream.entity.js';
import { CommunityPost } from './community/entities/community-post.entity.js';
import { CommunityComment } from './community/entities/community-comment.entity.js';
import { Donation } from './donations/entities/donation.entity.js';
import { PoiPageBlock } from './poi-page/entities/poi-page-block.entity.js';
import { ModuleType } from './common/enums/module-type.enum.js';
import { ModuleStatus } from './common/enums/module-status.enum.js';
import { LivestreamStatus } from './common/enums/livestream-status.enum.js';
import { PoiType } from './common/enums/poi-type.enum.js';
import { MemberRole } from './common/enums/member-role.enum.js';
import { Language } from './common/enums/language.enum.js';
import { PageBlockType } from './common/enums/page-block-type.enum.js';

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
  username: process.env.DB_USERNAME ?? 'ansae',
  password: process.env.DB_PASSWORD ?? 'ansae',
  database: process.env.DB_NAME ?? 'ansae',
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
    PoiPageBlock,
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
  const eventRepository = dataSource.getRepository(Event);
  const prayerRequestRepository = dataSource.getRepository(PrayerRequest);
  const livestreamRepository = dataSource.getRepository(Livestream);
  const communityPostRepository = dataSource.getRepository(CommunityPost);
  const communityCommentRepository = dataSource.getRepository(CommunityComment);
  const donationRepository = dataSource.getRepository(Donation);
  const pageBlockRepository = dataSource.getRepository(PoiPageBlock);

  const DONOR_NAMES = ['Margaret', 'Robert', 'Linda', 'Tom', 'Susan', 'James', 'Patricia', 'David', 'Carol'];
  const GIFT_AMOUNTS = [10, 15, 20, 25, 30, 50, 75, 100];

  // ~9 weeks of donation history, so the admin dashboard has real
  // week-over-week and month-over-month comparisons and a full 30-day
  // chart. Sunday (the main service day) gets a clear bump over the rest
  // of the week, with a gentle upward trend and random noise so it reads
  // as real data rather than a straight line.
  async function seedDonations(target: Poi, scale: number) {
    const existingCount = await donationRepository.count({ where: { poi: { id: target.id } } });
    if (existingCount > 0) return;

    const daysBack = 63;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const donations: Donation[] = [];

    for (let i = daysBack; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      const isSunday = day.getDay() === 0;
      const weekIndex = Math.floor((daysBack - i) / 7);
      const growth = 1 + weekIndex * 0.015;

      const giftsToday = isSunday
        ? Math.round((6 + Math.random() * 9) * scale)
        : Math.random() < 0.55
          ? Math.round((Math.random() * 3) * scale)
          : 0;

      for (let j = 0; j < giftsToday; j++) {
        const base = GIFT_AMOUNTS[Math.floor(Math.random() * GIFT_AMOUNTS.length)];
        const amount = Math.round(base * growth * (0.85 + Math.random() * 0.3) * 100) / 100;
        const createdAt = new Date(day);
        const hour = isSunday ? 8 + Math.floor(Math.random() * 4) : 7 + Math.floor(Math.random() * 14);
        createdAt.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
        donations.push(
          donationRepository.create({
            poi: target,
            amount,
            donorName: Math.random() < 0.4 ? DONOR_NAMES[Math.floor(Math.random() * DONOR_NAMES.length)] : undefined,
            createdAt,
          }),
        );
      }
    }

    await donationRepository.save(donations);
    console.log(`Seeded ${donations.length} demo donations for ${target.name}`);
  }

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
        description: 'A welcoming Catholic parish in the heart of Springfield, serving families for over 80 years.',
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
        description: 'Una comunidad acogedora de habla hispana en el centro de Springfield.',
        qrCodeToken: DEMO_QR_TOKEN_2,
      }),
    );
    console.log(`Created demo POI ${poi2.id}`);
  } else {
    console.log(`Demo POI already exists: ${poi2.id}`);
  }
  await activateAllModules(poi2);

  // Demonstrate the language feature: give the two demo POIs different
  // content languages. Unconditional (not gated by "just created") so it
  // also takes effect on a database seeded before this column existed.
  if (poi.language !== Language.EN) {
    poi.language = Language.EN;
    await poiRepository.save(poi);
  }
  if (poi2.language !== Language.ES) {
    poi2.language = Language.ES;
    await poiRepository.save(poi2);
  }

  const poi2AnnouncementCount = await announcementRepository.count({
    where: { poi: { id: poi2.id } },
  });
  if (poi2AnnouncementCount === 0) {
    // Written in Spanish, matching this POI's content language (see
    // above) — POI content isn't translated for readers, only the app's
    // own menus are, so this is exactly what a Spanish-speaking parish's
    // announcement should look like.
    await announcementRepository.save(
      announcementRepository.create({
        poi: poi2,
        title: 'Bienvenidos a Holy Trinity Chapel',
        body: 'Este es un anuncio de muestra para nuestra segunda parroquia, usado para mostrar el panel de administración.',
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

  const eventCount = await eventRepository.count({
    where: { poi: { id: poi.id } },
  });
  if (eventCount === 0) {
    const now = new Date();
    const upcomingSunday = new Date(now);
    upcomingSunday.setDate(upcomingSunday.getDate() + ((7 - upcomingSunday.getDay()) % 7 || 7));
    upcomingSunday.setHours(10, 0, 0, 0);
    const baptism = new Date(upcomingSunday);
    baptism.setDate(baptism.getDate() + 7);
    baptism.setHours(14, 0, 0, 0);
    const potluck = new Date(upcomingSunday);
    potluck.setDate(potluck.getDate() + 13);
    potluck.setHours(18, 0, 0, 0);
    await eventRepository.save([
      eventRepository.create({
        poi,
        title: 'Sunday Mass',
        startsAt: upcomingSunday,
        location: 'Main Hall',
      }),
      eventRepository.create({
        poi,
        title: 'Baptism Ceremony',
        startsAt: baptism,
        location: 'Chapel',
      }),
      eventRepository.create({
        poi,
        title: 'Community Potluck',
        startsAt: potluck,
        location: 'Parish Hall',
        description: 'Bring a dish to share — all are welcome!',
      }),
    ]);
    console.log('Seeded demo events');
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

  // A worked example of a home page, so the demo shows what a POI can
  // build for itself rather than the bare fallback. Only St. Mary's gets
  // one — Holy Trinity is left empty on purpose, so both paths are
  // visible side by side.
  const pageBlockCount = await pageBlockRepository.count({
    where: { poi: { id: poi.id } },
  });
  if (pageBlockCount === 0) {
    await pageBlockRepository.save([
      pageBlockRepository.create({
        poi,
        position: 0,
        type: PageBlockType.TEXT,
        title: 'Welcome to St. Mary’s',
        body: 'A welcoming parish in the heart of Springfield. Whether you have been coming for fifty years or are walking in for the first time, there is a seat for you. Sunday Mass is at 10:00, and the doors open half an hour before.',
      }),
      pageBlockRepository.create({
        poi,
        position: 1,
        type: PageBlockType.NEXT_EVENTS,
        itemCount: 3,
      }),
      pageBlockRepository.create({
        poi,
        position: 2,
        type: PageBlockType.LATEST_ANNOUNCEMENTS,
        itemCount: 2,
      }),
      pageBlockRepository.create({
        poi,
        position: 3,
        type: PageBlockType.TEXT,
        title: 'Visiting us',
        body: 'The parish office is open weekdays from 9am to 4pm. There is step-free access on the side entrance from the car park, and a hearing loop in the first four rows.',
      }),
      pageBlockRepository.create({
        poi,
        position: 4,
        type: PageBlockType.DONATE,
        title: 'Support the parish',
        body: 'Every gift keeps the lights on, the food pantry stocked and the doors open.',
      }),
    ]);
    console.log('Seeded a demo home page for St. Mary’s');
  }

  await seedDonations(poi, 1);
  await seedDonations(poi2, 0.4);

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
