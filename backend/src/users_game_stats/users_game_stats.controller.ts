import {
  Controller,
  Post,
  Param,
  Request,
  Body,
  Delete,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersGameStatsService } from './users_game_stats.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users-game-stats')
export class UsersGameStatsController {
  constructor(private readonly usersGameStatsService: UsersGameStatsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createUserGameStats() {
    return this.usersGameStatsService.create();
  }

  @Get()
  @UseGuards()
  async findAll() {
    return this.usersGameStatsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersGameStatsService.findOne(id);
  }

  @Put() 
  @UseGuards(AuthGuard)
  async update(@Body() body: any, @Request() req) {
    const userId = req.user.id; 
    return this.usersGameStatsService.update(userId, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async remove(@Request() req) {
    const userId = req.user.id;
    return this.usersGameStatsService.delete(userId);
  }
}
