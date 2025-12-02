import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Storage } from './'

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Storage, (storage) => storage.cards, { onDelete: 'CASCADE' })
  storage: Storage;
}
