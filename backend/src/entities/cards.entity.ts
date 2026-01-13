import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from "typeorm";
import { Storage } from "./";
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
}
