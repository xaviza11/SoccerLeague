import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("games")
export class Game {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  player_one_id: string;

  @Column("uuid", { nullable: true })
  player_two_id: string | null;

  @Column("boolean", { default: false })
  is_ai_game: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
