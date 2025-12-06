import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Storage, UserStats } from './';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: false, default: () => "' '" })
  recovery_password: string;

  @OneToOne(() => Storage, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  storage: Storage;

  @OneToOne(() => UserStats, (stats) => stats.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  stats: UserStats;
}
