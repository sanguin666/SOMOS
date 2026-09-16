import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { CommunityPost } from './community-post.entity.js';

@Entity('community_comments')
export class CommunityComment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CommunityPost, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post!: Relation<CommunityPost>;

  @Column({ name: 'author_name', nullable: true })
  authorName?: string;

  @Column('text')
  message!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
