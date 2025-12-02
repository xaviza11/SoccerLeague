import { Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Storage } from './';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Storage, storage => storage.team, { onDelete: 'CASCADE' })
  storage: Storage;
}
