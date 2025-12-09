import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import {User, Storage, UserStats, Card, Team, PositionChangeCard, Player, Game} from './src/entities'

config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Storage, UserStats, Card, Team, PositionChangeCard, Player, Game],
  migrations: ['dist/migrations/*.js'],
});
