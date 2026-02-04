import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("games")
export class Game {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  playerOneId: string;

  @Column("uuid", { nullable: true })
  playerTwoId: string | null;

  @Column("boolean", { default: false })
  isAiGame: boolean;

  @Column("int")
  playerOneElo: number;

  @Column("int", { nullable: true })
  playerTwoElo: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
