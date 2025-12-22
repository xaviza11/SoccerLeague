import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Card, Team } from './';
import {
  Countries,
  DefensiveInstructions,
  OffensiveInstructions,
  Positions,
} from '../enums';

class Skills {
  @Column({ default: 0 }) shooting: number;
  @Column({ default: 0 }) passing: number;
  @Column({ default: 0 }) dribbling: number;
  @Column({ default: 0 }) defense: number;
  @Column({ default: 0 }) physical: number;
  @Column({ default: 0 }) speed: number;
  @Column({ default: 0 }) stamina: number;
  @Column({ default: 0 }) vision: number;
  @Column({ default: 0 }) crossing: number;
  @Column({ default: 0 }) finishing: number;
  @Column({ default: 0 }) aggression: number;
  @Column({ default: 0 }) composure: number;
  @Column({ default: 0 }) control: number;
  @Column({ default: 0 }) intuition: number;
  @Column({ default: 0 }) handling: number;
  @Column({ default: 0 }) kicking: number;
  @Column({ default: 0 }) reflexes: number;
}

class Instructions {
  @Column('enum', { enum: OffensiveInstructions, array: true, default: [] })
  offensive: OffensiveInstructions[];

  @Column('enum', { enum: DefensiveInstructions, array: true, default: [] })
  defensive: DefensiveInstructions[];
}

class Stats {
  @Column({ default: 0 }) goals: number;
  @Column({ default: 0 }) total_shots: number;
  @Column({ default: 0 }) total_passes: number;
  @Column({ default: 0 }) faults: number;
  @Column({ default: 0 }) assists: number;
  @Column({ default: 0 }) red_cards: number;
  @Column({ default: 0 }) yellow_cards: number;
  @Column({ default: 0 }) total_games: number;
}

class Status {
  @Column() age: number;
  @Column({ default: true }) is_active: boolean;
  @Column({ nullable: true }) injured_until: string;
  @Column() retirement_age: number;
}

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Countries,
  })
  country: Countries;

  @Column({
    type: 'enum',
    enum: Positions,
  })
  position: Positions;

  @Column({
    type: 'enum',
    enum: Positions,
  })
  current_position: Positions;

  @Column({
    type: 'enum',
    enum: Positions,
  })
  original_position: Positions;

  @Column()
  max_skill_level: number;

  @Column()
  height_cm: number;

  @Column({ nullable: true })
  image: string;

  @OneToOne(() => Card, { nullable: true })
  @JoinColumn()
  card: Card | null;

  @Column()
  number: number;

  @Column(() => Skills)
  skills: Skills;

  @Column(() => Status)
  status: Status;

  @Column(() => Instructions)
  instructions: Instructions;

  @Column(() => Stats)
  stats: Stats;

  @ManyToOne(() => Team, (team) => team.players, { nullable: false })
  team: Team;
}
