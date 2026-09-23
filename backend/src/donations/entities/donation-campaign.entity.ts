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

const money = {
  to: (value: number | null | undefined) => value,
  from: (value: string | null) => (value === null ? null : Number.parseFloat(value)),
};

/**
 * A project a community raises money for — the roof, the organ, a
 * pilgrimage — with a goal the app shows progress towards. What has been
 * raised is never stored: it is the sum of the completed gifts pointing
 * at the campaign, so it can't drift from the gifts themselves.
 */
@Entity('donation_campaigns')
export class DonationCampaign {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Poi, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poi_id' })
  poi!: Relation<Poi>;

  @Column()
  title!: string;

  @Column('text', { nullable: true })
  description?: string | null;

  // null: a campaign with no target, shown as what has been raised so far.
  @Column('numeric', { name: 'goal_amount', precision: 10, scale: 2, nullable: true, transformer: money })
  goalAmount?: number | null;

  @Column('timestamptz', { name: 'ends_at', nullable: true })
  endsAt?: Date | null;

  // Off: hidden from the app, still listed (with its gifts) in the dashboard.
  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
