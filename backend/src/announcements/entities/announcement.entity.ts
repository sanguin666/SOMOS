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
 * A bulletin/newsletter-style announcement posted by a POI
 * (e.g. weekly bulletin, schedule changes, general news).
 */
@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Poi, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poi_id' })
  poi!: Relation<Poi>;

  @Column()
  title!: string;

  @Column('text', { nullable: true })
  body?: string;

  // Relative path (e.g. /uploads/announcements/<file>.m4a) to an optional
  // voice message recorded in the app, e.g. by church staff instead of
  // typing. Served statically; the app prefixes it with its API base URL.
  @Column({ name: 'audio_url', nullable: true })
  audioUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
