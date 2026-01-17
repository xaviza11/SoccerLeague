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
