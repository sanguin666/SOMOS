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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Login identifier for congregants: phone number + SMS code (not built
  // yet). Nullable because admin users (see below) don't have one.
  @Column({ unique: true, nullable: true })
  phone?: string;

  // Login identifier for POI admins (email + password), used by the
  // separate admin dashboard. Nullable because congregant users don't
  // have one.
  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash?: string;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @OneToMany(() => UserPoi, (membership) => membership.user)
  pois!: Relation<UserPoi>[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
