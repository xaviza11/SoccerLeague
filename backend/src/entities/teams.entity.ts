import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  Column,
} from 'typeorm';
import { Storage, Player, Aura } from './';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Player, (player) => player.team, { onDelete: 'CASCADE' })
  players: Player[];

  @OneToOne(() => Storage, (storage) => storage.team, { onDelete: 'CASCADE' })
  storage: Storage;

  @OneToMany(() => Player, (player) => player.team, { cascade: true })
  bench_players: Player[];

  @OneToMany(() => Aura, (aura) => aura.team, { cascade: true, nullable: true })
  auras: Aura[];
}
