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
 * Where a gift is in the payment flow. A gift made through Stripe starts
 * PENDING and only becomes COMPLETED once Stripe confirms the payment, so
 * an abandoned checkout never shows up in the parish's totals.
 */
export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * A single gift to a POI. Gifts go through Stripe Checkout when the backend
 * has a Stripe key configured (see donations/stripe.service.ts); without one
 * the app falls back to the demo flow, which records the amount without
 * moving any money so the admin dashboard's graph still has data to show.
 */
@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Poi, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poi_id' })
  poi!: Relation<Poi>;

  // Stored as numeric so Postgres keeps exact cents; the pg driver returns
  // numeric columns as strings, so a transformer parses it back to a number.
  @Column('numeric', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number.parseFloat(value),
    },
  })
  amount!: number;

  // ISO 4217, lowercase to match Stripe's own representation.
  @Column({ default: 'eur' })
  currency!: string;

  // Defaults to COMPLETED so demo-flow gifts and rows seeded before Stripe
  // existed keep counting towards the totals; the Stripe flow sets PENDING
  // explicitly and promotes the row once the payment confirms.
  @Column({ type: 'varchar', default: DonationStatus.COMPLETED })
  status!: DonationStatus;

  @Column({ name: 'stripe_session_id', nullable: true })
  stripeSessionId?: string;

  @Column({ name: 'stripe_payment_intent_id', nullable: true })
  stripePaymentIntentId?: string;

  @Column({ name: 'donor_name', nullable: true })
  donorName?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
