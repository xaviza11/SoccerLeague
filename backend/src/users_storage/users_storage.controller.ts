import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  UseGuards,
  Request,
  Param
} from '@nestjs/common';
import { UsersStorageService } from './users_storage.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users-storage')
export class UsersStorageController {
  constructor(private readonly usersStorageService: UsersStorageService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createStorage(@Request() req) {
    return this.usersStorageService.createStorage();
  }

  @Post('positions-change')
  @UseGuards(AuthGuard)
  async addPositionCard(@Request() req, @Body('card') card: string) {
    return this.usersStorageService.addPositionChangeCard(req.user.id, card);
  }

  @Post('cards')
  @UseGuards(AuthGuard)
  async addCard(@Request() req, @Body('card') card: string) {
    return this.usersStorageService.addCard(req.user.id, card);
  }

  @Post('team')
  @UseGuards(AuthGuard)
  async addTeam(@Request() req, @Body('teamId') teamId: string) {
    return this.usersStorageService.addTeam(req.user.id, teamId);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteStorage(@Request() req) {
    return this.usersStorageService.deleteStorage(req.user.id);
  }

  @Get(':id') @UseGuards(AuthGuard) async findOne(@Param('id') id: string) {
    return this.usersStorageService.findOne(id);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async findAll(@Request() req) {
    return this.usersStorageService.findAll();
  }
}
