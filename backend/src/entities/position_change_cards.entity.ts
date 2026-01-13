import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { Storage } from "./";
import { Positions } from "../enums";

@Entity()
export class PositionChangeCard {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: Positions })
  new_position: Positions;

  @Column({ type: "uuid" })
  storage_id: string;

  @ManyToOne(() => Storage, (storage) => storage.position_change_cards, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "storage_id" })
  storage: Storage;
}
