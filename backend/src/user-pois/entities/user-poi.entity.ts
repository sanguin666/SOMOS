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
import { Poi } from '../../pois/entities/poi.entity.js';
import { MemberRole } from '../../common/enums/member-role.enum.js';

/**
 * Many-to-many join table between `users` and `pois`:
 * a user can belong to several POIs.
 */
@Entity('user_pois')
@Index(['user', 'poi'], { unique: true })
export class UserPoi {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.pois, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<User>;

  @ManyToOne(() => Poi, (poi) => poi.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poi_id' })
  poi!: Relation<Poi>;

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole.MEMBER,
  })
  role!: MemberRole;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt!: Date;
}
