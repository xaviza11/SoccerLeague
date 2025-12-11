import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async createTeam() {
    return this.teamsService.create();
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllTeams() {
    return this.teamsService.find();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOneTeam(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Put('/me')
  @UseGuards(AuthGuard)
  async updateMyTeam(@Req() req, @Body() body: any) {
    const teamId = req.user.teamId;

    if (!teamId) {
      throw new BadRequestException('User not have one team assigned');
    }

    return this.teamsService.update(teamId, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteTeamById(@Param('id') id: string) {
    return this.teamsService.delete(id);
  }
}
