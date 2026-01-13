import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from "typeorm";
import { Card } from "./";

@Entity({ name: "market_cards" })
export class MarketCard {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Card, { onDelete: "NO ACTION" })
  @JoinColumn({ name: "card_id" })
  card: Card;

  @Column("uuid")
  card_id: string;

  @Column("uuid")
  seller_id: string;

  @Column("int")
  price: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
