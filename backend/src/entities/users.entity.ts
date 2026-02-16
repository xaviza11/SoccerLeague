import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Storage, UserStats } from "./";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: false, default: () => "' '" })
  recovery_password: string;

  @Index()
  @OneToOne(() => Storage, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  storage: Storage;


  @Index()
  @OneToOne(() => UserStats, (stats) => stats.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  stats: UserStats;

  @Column({ default: false })
  has_game: boolean;
}
