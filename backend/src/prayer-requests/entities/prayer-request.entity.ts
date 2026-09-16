import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Poi } from '../../pois/entities/poi.entity.js';

/**
 * A prayer request shared with the POI's community. Anyone can add a
 * "praying" tap (prayerCount) without needing to be signed in yet.
 */
@Entity('prayer_requests')
export class PrayerRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Poi, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poi_id' })
  poi!: Relation<Poi>;

  @Column({ name: 'author_name', nullable: true })
  authorName?: string;

  @Column('text')
  message!: string;

  @Column({ name: 'prayer_count', default: 0 })
  prayerCount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
