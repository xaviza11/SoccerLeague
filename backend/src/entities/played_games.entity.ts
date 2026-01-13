// register of games played
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("game_history")
export class GameHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  player_one_id: string;

  @Column("uuid", { nullable: true })
  player_two_id: string | null;

  @Column("boolean", { default: false })
  is_ai_game: boolean;

  @Column("jsonb")
  result: [number, number];

  @Column("jsonb", { array: false, default: [] })
  logs: any[];

  @CreateDateColumn()
  createdAt: Date;
}
