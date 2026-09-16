import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity.js';
import { Poi } from './pois/entities/poi.entity.js';
import { UserPoi } from './user-pois/entities/user-poi.entity.js';
import { ActiveModule } from './active-modules/entities/active-module.entity.js';
import { ModuleType } from './common/enums/module-type.enum.js';
import { ModuleStatus } from './common/enums/module-status.enum.js';

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
  entities: [User, Poi, UserPoi, ActiveModule],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const poiRepository = dataSource.getRepository(Poi);
  const activeModuleRepository = dataSource.getRepository(ActiveModule);

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

  for (const moduleType of [ModuleType.DONATIONS, ModuleType.EVENTS]) {
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

  console.log('\nDemo POI ready:');
  console.log(`  id:       ${poi.id}`);
  console.log(`  QR token: ${poi.qrCodeToken}`);

  await dataSource.destroy();
}

await seed();
