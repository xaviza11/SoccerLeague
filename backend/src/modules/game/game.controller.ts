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

@UseGuards(AuthGuard)
@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(
    @Body("player_one_id") player_one_id: string,
    @Body("player_two_id") player_two_id: string | null,
    @Body("is_ai_game") is_ai_game: boolean,
  ) {
    if (!is_ai_game && !player_two_id) {
      throw new BadRequestException("player_two_id is required unless is_ai_game = true");
    }

    return this.gameService.create(player_one_id, player_two_id, is_ai_game);
  }

  @Get()
  async findAll() {
    return this.gameService.findAll();
  }

  @Get("user")
  async findAllByUser(@User("id") userId: string) {
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
