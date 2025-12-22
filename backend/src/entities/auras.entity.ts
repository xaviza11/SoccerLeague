import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from "typeorm";
import { Storage, Team } from './'
import { Auras } from "../enums";

@Entity()
export class Aura {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: Auras,
    default: Auras.NONE
  })
  name: Auras

  @ManyToOne(() => Storage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storage_id' })
  storage: Storage;

  @Column('uuid')
  storage_id: string; 

  @ManyToOne(() => Team, (team) => team.auras, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
