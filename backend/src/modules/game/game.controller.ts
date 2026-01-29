import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorators/user.decorator";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(
    @Body("playerOneId") playerOneId: string,
    @Body("playerTwoId") playerTwoId: string | null,
    @Body("isAiGame") isAiGame: boolean,
  ) {
    if (!isAiGame && !playerTwoId) {
      throw new BadRequestException("playerTwoId is required unless isAiGame = true");
    }

    return this.gameService.create(playerOneId, playerTwoId, isAiGame);
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
