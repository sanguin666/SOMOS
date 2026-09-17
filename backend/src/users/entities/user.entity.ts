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
import { Language } from '../../common/enums/language.enum.js';

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

  // UI language for this user's own account. Meaningful today for admins
  // (who have a real session) — the admin dashboard reads/writes it.
  // Congregant users don't have a session yet, so the app's language
  // switcher is a device-local preference instead; this column is here so
  // it becomes real once congregant login exists.
  @Column({ type: 'enum', enum: Language, default: Language.EN })
  language!: Language;

  @OneToMany(() => UserPoi, (membership) => membership.user)
  pois!: Relation<UserPoi>[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
