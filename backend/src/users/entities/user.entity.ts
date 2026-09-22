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

  // `select: false` so the hash is left out of every query that doesn't
  // ask for it by name. Without it, any endpoint returning a User — or a
  // relation that loads one — hands out the parish admin's password hash.
  // Only UsersService.findByEmailForLogin selects it.
  @Column({ name: 'password_hash', nullable: true, select: false })
  passwordHash?: string;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  // Relative path (e.g. /uploads/avatars/<file>.jpg) to the picture this
  // person chose for themselves, served statically like every other
  // upload. Nullable because most people never set one — the app draws
  // their initials instead.
  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl?: string;

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
