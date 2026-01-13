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

@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTeam(@Req() req) {
    const userId = req.user.id;
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

  @Put("/update")
  @UseGuards(AuthGuard)
  async updateMyTeam(@Req() req, @Body() body: any) {
    const userId = req.user.id;
    const { teamId, ...updateData } = body;

    if (!teamId) {
      throw new BadRequestException("teamId is required");
    }

    return this.teamsService.update(teamId, updateData, userId);
  }

  @Delete("/delete/:id")
  @UseGuards(AuthGuard)
  async deleteMyTeam(@Req() req, @Param("id") id: string) {
    const userId = req.user.id;
    return this.teamsService.delete(id, userId);
  }
}
