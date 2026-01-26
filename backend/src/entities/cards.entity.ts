import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from "typeorm";
import { Storage, Player } from "./";
import { Cards } from "../enums";

@Entity()
export class Card {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: Cards,
    default: Cards.NONE,
  })
  name: Cards;

  @Column("uuid")
  storage_id: string;

  @ManyToOne(() => Storage, { onDelete: "CASCADE" })
  @JoinColumn({ name: "storage_id" })
  storage: Storage;

  @ManyToOne(() => Player, (player) => player.card, { nullable: true })
  @JoinColumn({ name: "player_id" })
  player: Player;

  @Column({ type: "uuid", nullable: true })
  player_id: string;
}
