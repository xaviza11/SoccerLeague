import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Storage } from './';

@Entity()
export class PositionChangeCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Storage, storage => storage.position_change_cards, { onDelete: 'CASCADE' })
  storage: Storage;
}
