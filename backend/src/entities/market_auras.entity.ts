import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from "typeorm";
import { Aura } from "./";

@Entity({ name: "market_auras" })
export class MarketAura {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Aura, { onDelete: "NO ACTION" }) 
  @JoinColumn({ name: "aura_id" })
  aura: Aura;

  @Column("uuid")
  aura_id: string;

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
