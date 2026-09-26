import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Event } from '../../events/entities/event.entity.js';

/**
 * Someone rang the bell on an event: they get a push an hour before it
 * starts. `remindedAt` marks the reminder as sent so it goes out once.
 */
@Entity('event_reminders')
@Index(['user', 'event'], { unique: true })
export class EventReminder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<User>;

  @ManyToOne(() => Event, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'event_id' })
  event!: Relation<Event>;

  @Column('timestamptz', { name: 'reminded_at', nullable: true })
  remindedAt?: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
