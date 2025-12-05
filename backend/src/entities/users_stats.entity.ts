import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Index } from 'typeorm';
import { User } from './';

@Entity()
export class UserStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_userstats_elo')
  @Column()
  elo: number;

  @Column()
  money: number;

  @Column()
  total_games: number;

  @OneToOne(() => User, user => user.stats, {onDelete: 'CASCADE'})
  user: User;
}
