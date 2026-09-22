import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Poi } from '../../pois/entities/poi.entity.js';

/**
 * A scheduled event posted by a POI (Mass times, baptisms, weddings,
 * funerals, communions, community gatherings, etc.).
 */
@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Poi, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poi_id' })
  poi!: Relation<Poi>;

  @Column()
  title!: string;

  @Column({ name: 'starts_at', type: 'timestamptz' })
  startsAt!: Date;

  // The column type has to be spelled out: TypeORM reads it from the
  // property's reflected type, and a `string | null` union reflects as
  // `Object`, which Postgres has no data type for.
  @Column('varchar', { nullable: true })
  location?: string | null;

  @Column('text', { nullable: true })
  description?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
