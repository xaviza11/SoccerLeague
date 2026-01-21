import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, Column } from "typeorm";
import { Storage, Player, Aura } from "./";

@Entity()
export class Team {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Storage, (storage) => storage.team, { onDelete: "CASCADE" })
  storage: Storage;

  @OneToMany(() => Player, (player) => player.team, { cascade: true })
  players: Player[];

  @OneToMany(() => Aura, (aura) => aura.team, { cascade: true, nullable: true })
  auras: Aura[];
}

