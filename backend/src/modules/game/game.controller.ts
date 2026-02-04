import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  BadRequestException,
  ParseUUIDPipe,
  StreamableFile,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorators/user.decorator";
import * as readline from "node:readline";
import { Readable, Transform } from "node:stream";

interface CreateGameDto {
  playerOneId: string;
  playerTwoId: string | null;
  isAiGame: boolean;
  playerOneElo: number;
  playerTwoElo: number | null;
}

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(
    @Body("playerOneId") playerOneId: string,
    @Body("playerTwoId") playerTwoId: string | null,
    @Body("isAiGame") isAiGame: boolean,
    @Body("playerOneElo") playerOneElo: number,
    @Body("playerTwoElo") playerTwoElo: number | null,
  ) {
    if (!isAiGame && !playerTwoId) {
      throw new BadRequestException(
        "playerTwoId is required unless isAiGame = true",
      );
    }

    return this.gameService.create(
      playerOneId,
      playerTwoId,
      isAiGame,
      playerOneElo,
      playerTwoElo,
    );
  }

  @Post("create/many")
  async createMany(@Body() games: CreateGameDto[]): Promise<boolean> {
    await this.gameService.createMany(games);
    return true;
  }

  @Get()
  async findAll() {
    return this.gameService.findAll();
  }

  @Get("user")
  async findAllByUser(@User("sub") userId: string) {
    return this.gameService.findAllByUser(userId);
  }

  @Get(":id")
  async findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.gameService.findOne(id);
  }

  @Delete(":id")
  async deleteOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.gameService.remove(id);
  }
}
