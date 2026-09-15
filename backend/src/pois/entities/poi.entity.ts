import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { UserPoi } from '../../user-pois/entities/user-poi.entity.js';
import { ActiveModule } from '../../active-modules/entities/active-module.entity.js';

/**
 * A point of interest a user can join: a church today, potentially other
 * kinds of venues/organizations later (the product started with churches,
 * hence "POI" rather than a narrower name).
 */
@Entity('pois')
export class Poi {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode?: string;

  // Unique token encoded in the QR code printed on the flyer displayed at
  // the POI's entrance, used for automatic onboarding of a user.
  @Column({ name: 'qr_code_token', unique: true })
  qrCodeToken!: string;

  @OneToMany(() => UserPoi, (membership) => membership.poi)
  members!: Relation<UserPoi>[];

  @OneToMany(() => ActiveModule, (activeModule) => activeModule.poi)
  activeModules!: Relation<ActiveModule>[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
