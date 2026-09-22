import { DataSource } from 'typeorm';
import { ENTITIES } from './typeorm.config.js';

/**
 * Builds the entity metadata the way the app does at startup, but without a
 * database. TypeORM reads a column's type from the property's reflected
 * type unless the decorator spells one out, and a union like
 * `string | null` reflects as `Object`, which Postgres has no data type
 * for. That only surfaces when the app connects, so `npm run build` and the
 * unit tests both pass while the backend refuses to start. This catches it.
 */
describe('TypeORM entity metadata', () => {
  it('maps every column to a type Postgres supports', async () => {
    const dataSource = new DataSource({ type: 'postgres', entities: ENTITIES });
    // buildMetadatas() is protected. Building the metadata is exactly what
    // this test needs, and every public route to it also opens a
    // connection, so reach it through a cast rather than requiring a
    // database to catch a mapping mistake.
    const buildMetadatas = (
      dataSource as unknown as { buildMetadatas(): Promise<void> }
    ).buildMetadatas.bind(dataSource);
    await expect(buildMetadatas()).resolves.not.toThrow();
  });
});
