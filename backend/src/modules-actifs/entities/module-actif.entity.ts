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
import { LieuDeCulte } from '../../lieux-de-culte/entities/lieu-de-culte.entity.js';
import { TypeModule } from '../../common/enums/type-module.enum.js';
import { StatutModule } from '../../common/enums/statut-module.enum.js';

/**
 * Module produit souscrit par un lieu de culte (ex: dons, événements),
 * avec son propre statut/date d'expiration d'abonnement.
 */
@Entity('modules_actifs')
@Index(['lieuDeCulte', 'typeModule'], { unique: true })
export class ModuleActif {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => LieuDeCulte, (lieuDeCulte) => lieuDeCulte.modulesActifs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lieu_de_culte_id' })
  lieuDeCulte!: Relation<LieuDeCulte>;

  @Column({ name: 'type_module', type: 'enum', enum: TypeModule })
  typeModule!: TypeModule;

  @Column({
    type: 'enum',
    enum: StatutModule,
    default: StatutModule.ESSAI,
  })
  statut!: StatutModule;

  @Column({ name: 'date_debut', type: 'timestamptz', default: () => 'now()' })
  dateDebut!: Date;

  @Column({ name: 'date_expiration', type: 'timestamptz', nullable: true })
  dateExpiration?: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
