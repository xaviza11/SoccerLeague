import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from "typeorm";
import { PositionChangeCard } from "./";

@Entity({ name: "market_position_change_cards" })
export class MarketPositionChangeCard {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => PositionChangeCard, { onDelete: "NO ACTION" })
  @JoinColumn({ name: "position_change_card_id" })
  positionChangeCard: PositionChangeCard;

  @Column("uuid")
  position_change_card_id: string;

  @Column("uuid")
  seller_id: string;

  @Column("int")
  price: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP"
  })
  updatedAt: Date;
}
