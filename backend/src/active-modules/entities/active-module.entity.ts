import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Poi } from '../../pois/entities/poi.entity.js';
import { ModuleType } from '../../common/enums/module-type.enum.js';
import { ModuleStatus } from '../../common/enums/module-status.enum.js';

/**
 * A product module (e.g. donations, events) subscribed to by a POI,
 * with its own subscription status/expiration date.
 */
@Entity('active_modules')
@Index(['poi', 'moduleType'], { unique: true })
export class ActiveModule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Poi, (poi) => poi.activeModules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poi_id' })
  poi!: Relation<Poi>;

  @Column({ name: 'module_type', type: 'enum', enum: ModuleType })
  moduleType!: ModuleType;

  @Column({
    type: 'enum',
    enum: ModuleStatus,
    default: ModuleStatus.TRIAL,
  })
  status!: ModuleStatus;

  @Column({ name: 'start_date', type: 'timestamptz', default: () => 'now()' })
  startDate!: Date;

  @Column({ name: 'expiration_date', type: 'timestamptz', nullable: true })
  expirationDate?: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
