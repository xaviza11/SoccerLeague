import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { PlayerService } from "./player.service";
import { AuthGuard } from "../../guards/auth.guard";
import { Player } from "../../entities";

@Controller("player")
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async create(@Req() req, @Body() body: Partial<Player>) {
    if (!body.name || !body.team) {
      throw new BadRequestException("Name and team are required");
    }
    return this.playerService.create({
      ...body,
    });
  }

  @Get()
  async findAll() {
    return this.playerService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.playerService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: Partial<Player>) {
    return this.playerService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.playerService.delete(id);
  }

  @Get("user/:userId")
  @UseGuards(AuthGuard)
  async findAllByUser(@Param("userId") userId: string) {
    return this.playerService.findAllPlayersByUser(userId);
  }
}
