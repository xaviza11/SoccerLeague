import { Module } from '@nestjs/common';
import { UsersGameStatsController } from './users_game_stats.controller';
import { UsersGameStatsService } from './users_game_stats.service';
import { UserStats } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserStats])],
  controllers: [UsersGameStatsController],
  providers: [UsersGameStatsService],
})
export class UsersGameStatsModule {}
