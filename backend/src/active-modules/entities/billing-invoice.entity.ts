import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Poi } from '../../pois/entities/poi.entity.js';
import { ModuleType } from '../../common/enums/module-type.enum.js';

export type BillingInvoiceLine = {
  moduleType: ModuleType;
  amount: number;
  periodStart: string;
  periodEnd: string;
};

/**
 * What a community was charged for its modules on one date: one invoice
 * per renewal, whatever the number of modules on it. Demo stage: recorded,
 * not taken (see ModuleBillingService).
 */
@Entity('billing_invoices')
@Index(['poi', 'issuedAt'])
export class BillingInvoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Poi, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poi_id' })
  poi!: Relation<Poi>;

  @Column({ name: 'issued_at', type: 'timestamptz' })
  issuedAt!: Date;

  @Column('numeric', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number.parseFloat(value),
    },
  })
  amount!: number;

  @Column('jsonb', { default: () => "'[]'" })
  lines!: BillingInvoiceLine[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
