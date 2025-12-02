import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Card, Team, PositionChangeCard, User } from './';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Team, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  team: Team;

  @OneToMany(() => PositionChangeCard, (pc) => pc.storage, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  position_change_cards: PositionChangeCard[];

  @OneToMany(() => Card, (card) => card.storage, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  cards: Card[];

  @OneToOne(() => User, (user) => user.storage)
  user: User;
}
