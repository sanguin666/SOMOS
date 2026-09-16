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
 * A post on a POI's community board. Comments on it live in
 * CommunityComment — kept as a separate flat (non-nested) list rather than
 * a threaded tree, to keep moderation and the UI simple for now.
 */
@Entity('community_posts')
export class CommunityPost {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Poi, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poi_id' })
  poi!: Relation<Poi>;

  @Column({ name: 'author_name', nullable: true })
  authorName?: string;

  @Column('text')
  message!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
