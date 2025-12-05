import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Storage } from './'
import { Cards } from "../enums";

@Entity()
export class Card {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: Cards,
    default: Cards.NONE
  })
  name: Cards

  @ManyToOne(() => Storage, (storage) => storage.cards, { onDelete: 'CASCADE' })
  storage: Storage;
}
