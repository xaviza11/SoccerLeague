import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  ParseUUIDPipe,
  Patch,
} from "@nestjs/common";
import { PlayedGamesService } from "./played_games.service";

@Controller("played-games")
export class PlayedGamesController {
  constructor(private readonly playedGamesService: PlayedGamesService) {}

  @Post()
  async create(
    @Body()
    body: {
      player_one_id: string;
      player_two_id?: string | null;
      is_ai_game?: boolean;
      result: [number, number];
      logs?: any[];
    },
  ) {
    if (!body.player_one_id || !body.result) {
      throw new BadRequestException("player_one_id and result are required");
    }

    return this.playedGamesService.create(body);
  }

  @Get()
  async findAll() {
    return this.playedGamesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.playedGamesService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body()
    updates: {
      player_one_id?: string;
      player_two_id?: string | null;
      is_ai_game?: boolean;
      result?: [number, number];
      logs?: any[];
    },
  ) {
    return this.playedGamesService.update(id, updates);
  }

  @Delete(":id")
  async delete(@Param("id", ParseUUIDPipe) id: string) {
    return this.playedGamesService.delete(id);
  }

  @Get("user/:userId")
  async findByUser(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.playedGamesService.findByUser(userId);
  }
}
