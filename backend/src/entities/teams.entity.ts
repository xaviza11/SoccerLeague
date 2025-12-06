import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { Storage, Player } from './';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Player, (player) => player.team)
  players: Player[];

  @OneToOne(() => Storage, (storage) => storage.team, { onDelete: 'CASCADE' })
  storage: Storage;
}
