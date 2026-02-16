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
} from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorators/user.decorator";

@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTeam(@User("sub") userId: string) {
    return this.teamsService.create(userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllTeams() {
    return this.teamsService.find();
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async findOneTeam(@Param("id") id: string) {
    return this.teamsService.findOne(id);
  }

  @Put("/lineup")
  @UseGuards(AuthGuard)
  async updateLineup(
    @User("sub") userId: string,
    @Body() body: any
  ) {
    const { teamId, players } = body;

    if (!teamId) {
      throw new BadRequestException("teamId is required");
    }

    if (!players || !Array.isArray(players) || players.length === 0) {
      throw new BadRequestException("players payload is required and must be an array");
    }

    return this.teamsService.updateLineup(teamId, players, userId);
  }

  @Post("/buy/player")
  @UseGuards(AuthGuard)
  async buyPlayer(
    @User("sub") userId: string, 
    @Body() body: { teamId: string; player: any }
  ) {
    const { teamId, player } = body;

    if (!teamId || !player) {
      throw new BadRequestException("teamId and player data are required");
    }

    return this.teamsService.addPlayerToTeam(teamId, player, userId);
  }

  @Put("/update")
  @UseGuards(AuthGuard)
  async updateMyTeam(@User("sub") userId: string, @Body() body: any) {
    const { teamId, ...updateData } = body;

    if (!teamId) {
      throw new BadRequestException("teamId is required");
    }

    return this.teamsService.update(teamId, updateData, userId);
  }

  @Delete("/delete/:id")
  @UseGuards(AuthGuard)
  async deleteMyTeam(@User("sub") userId: string, @Param("id") id: string) {
    return this.teamsService.delete(id, userId);
  }
}
