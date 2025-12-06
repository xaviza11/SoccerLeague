import { Module } from '@nestjs/common';
import { UsersGameStatsController } from './users_game_stats.controller';
import { UsersGameStatsService } from './users_game_stats.service';
import { UserStats, User } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserStats, User])],
  controllers: [UsersGameStatsController],
  providers: [UsersGameStatsService],
})
export class UsersGameStatsModule {}
