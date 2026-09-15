import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { UserLieuDeCulte } from '../../user-lieu-de-culte/entities/user-lieu-de-culte.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Identifiant de connexion : numéro de téléphone + code SMS (pas de mot de passe).
  @Column({ unique: true })
  telephone!: string;

  @Column({ nullable: true })
  prenom?: string;

  @Column({ nullable: true })
  nom?: string;

  @OneToMany(() => UserLieuDeCulte, (liaison) => liaison.user)
  lieuxDeCulte!: Relation<UserLieuDeCulte>[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
