import {
  Controller,
  Post,
  Param,
  Request,
  Body,
  Delete,
  Get,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersGameStatsService } from './users_game_stats.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users-game-stats')
export class UsersGameStatsController {
  constructor(
    private readonly usersGameStatsService: UsersGameStatsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createUserGameStats(@Param('id') id: string) {
    return this.usersGameStatsService.create(id);
  }

  @Get()
  async findAll() {
    return this.usersGameStatsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersGameStatsService.findOne(id);
  }

  @Get('/ranking/top')
  async getTop(@Query('limit') limit: number = 100) {
    return this.usersGameStatsService.getTop(Number(limit));
  }

  @Get('/ranking/leaderboard')
  async getLeaderboard(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.usersGameStatsService.getLeaderboard(
      Number(page),
      Number(limit),
    );
  }

  @Get('/ranking/rank/:userId')
  async getUserRank(@Param('userId') userId: string) {
    return this.usersGameStatsService.getUserRank(userId);
  }

  @Put()
  @UseGuards(AuthGuard)
  async update(@Body() body: any, @Request() req) {
    const statsId = req.user.statsId;
    return this.usersGameStatsService.update(statsId, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async remove(@Request() req) {
    const statsId = req.user.statsId;
    return this.usersGameStatsService.delete(statsId);
  }
}
