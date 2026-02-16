import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { Storage, Player, Aura } from "./";

@Entity()
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Storage, (storage) => storage.team)
  storage: Storage;

  @OneToMany(() => Player, (player) => player.team, { cascade: true })
  players: Player[];

  @OneToMany(() => Aura, (aura) => aura.team, { cascade: true, nullable: true })
  auras: Aura[];

  @BeforeInsert()
  @BeforeUpdate()
  validateLimits() {
    if (this.players && this.players.length > 40) {
      throw new Error(`Team must not have more than 40 players.`);
    }


    if (this.players && this.players.length < 22) {
      throw new Error(`Team must not have less than 22 players.`);
    }
  }
}
