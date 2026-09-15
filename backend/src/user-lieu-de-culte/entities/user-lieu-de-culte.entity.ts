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
import { User } from '../../users/entities/user.entity.js';
import { LieuDeCulte } from '../../lieux-de-culte/entities/lieu-de-culte.entity.js';
import { RoleMembre } from '../../common/enums/role-membre.enum.js';

/**
 * Table de liaison many-to-many entre `users` et `lieux_de_culte` :
 * un utilisateur peut être rattaché à plusieurs lieux de culte.
 */
@Entity('user_lieu_de_culte')
@Index(['user', 'lieuDeCulte'], { unique: true })
export class UserLieuDeCulte {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.lieuxDeCulte, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<User>;

  @ManyToOne(() => LieuDeCulte, (lieuDeCulte) => lieuDeCulte.membres, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lieu_de_culte_id' })
  lieuDeCulte!: Relation<LieuDeCulte>;

  @Column({
    type: 'enum',
    enum: RoleMembre,
    default: RoleMembre.MEMBRE,
  })
  role!: RoleMembre;

  @CreateDateColumn({ name: 'date_rattachement' })
  dateRattachement!: Date;
}
