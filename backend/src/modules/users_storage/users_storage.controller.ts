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
import { AuthGuard } from '../../guards/auth.guard';

@Controller('users-storage')
export class UsersStorageController {
  constructor(private readonly usersStorageService: UsersStorageService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createStorage(@Request() req) {
    return this.usersStorageService.createStorage(req.user.id);
  }

  @Post('positions-change')
  async addPositionCard(@Request() req, @Body('card') card: string, @Body('storageId') storageId: string) {
    return this.usersStorageService.addPositionChangeCard(storageId, card);
  }

  @Post('cards')
  async addCard(@Request() req, @Body('card') card: string, @Body('storageId') storageId: string) {
    return this.usersStorageService.addCard(storageId, card);
  }

  @Post('team')
  @UseGuards(AuthGuard)
  async addTeam(@Request() req, @Body('teamId') teamId: string, @Body('storageId') storageId: string) {
    return this.usersStorageService.addTeam(req.user.id, teamId, storageId);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteStorage(@Request() req, @Body('storageId') storageId: string) {
    return this.usersStorageService.deleteStorage(req.user.id, storageId);
  }

  @Get(':id') 
  @UseGuards(AuthGuard) 
  async findOne(@Param('id') id: string) {
    return this.usersStorageService.findOne(id);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async findAll(@Request() req) {
    return this.usersStorageService.findAll();
  }
}
