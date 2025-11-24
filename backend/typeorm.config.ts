import { DataSource } from 'typeorm';
import { User } from './src/entities/user.entity';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  migrations: ['dist/migrations/*.js'],
});
