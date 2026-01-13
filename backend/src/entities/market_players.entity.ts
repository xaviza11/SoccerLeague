import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from "typeorm";
import { Player } from "./";

@Entity({ name: "market_players" })
export class MarketPlayer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Player, { onDelete: "NO ACTION" })
  @JoinColumn({ name: "player_id" })
  player: Player;

  @Column("uuid")
  player_id: string;

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
