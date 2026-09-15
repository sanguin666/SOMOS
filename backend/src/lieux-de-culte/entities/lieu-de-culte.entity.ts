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
import { ModuleActif } from '../../modules-actifs/entities/module-actif.entity.js';

@Entity('lieux_de_culte')
export class LieuDeCulte {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nom!: string;

  @Column({ nullable: true })
  adresse?: string;

  @Column({ nullable: true })
  ville?: string;

  @Column({ name: 'code_postal', nullable: true })
  codePostal?: string;

  // Jeton unique encodé dans le QR code du flyer affiché à l'entrée du lieu de culte,
  // utilisé pour le rattachement automatique d'un utilisateur à l'onboarding.
  @Column({ name: 'qr_code_token', unique: true })
  qrCodeToken!: string;

  @OneToMany(() => UserLieuDeCulte, (liaison) => liaison.lieuDeCulte)
  membres!: Relation<UserLieuDeCulte>[];

  @OneToMany(() => ModuleActif, (moduleActif) => moduleActif.lieuDeCulte)
  modulesActifs!: Relation<ModuleActif>[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
