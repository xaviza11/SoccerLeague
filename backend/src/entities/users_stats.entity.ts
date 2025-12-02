import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './';

@Entity()
export class UserStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  elo: number;

  @Column()
  money: number;

  @Column()
  total_games: number;

  @OneToOne(() => User, user => user.stats)
  user: User;
}
