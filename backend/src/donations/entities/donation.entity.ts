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
 * A single gift to a POI. No payment processor is wired up yet (planned:
 * Stripe) — the app records the demo interaction without moving real money.
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

  @Column({ name: 'donor_name', nullable: true })
  donorName?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
