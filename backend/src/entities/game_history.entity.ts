// register of games played
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("game_history")
export class GameHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  playerOneId: string;

  @Column("uuid", { nullable: true })
  playerTwoId: string | null;

  @Column("jsonb", {default: [0, 0]})
  eloChange: [number, number];

  @Column("boolean", { default: false })
  isAiGame: boolean;

  @Column("jsonb")
  result: [number, number];

  @Column("jsonb", { array: false, default: [] })
  logs: any[];

  @CreateDateColumn()
  createdAt: Date;
}
