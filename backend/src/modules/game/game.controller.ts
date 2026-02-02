import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { GameService } from "./game.service";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorators/user.decorator";
import * as readline from 'node:readline';
import { Readable } from "node:stream";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(
    @Body("playerOneId") playerOneId: string,
    @Body("playerTwoId") playerTwoId: string | null,
    @Body("isAiGame") isAiGame: boolean,
    @Body("playerOneElo") playerOneElo: number,
    @Body("playerTwoElo") playerTwoElo: number | null
  ) {
    if (!isAiGame && !playerTwoId) {
      throw new BadRequestException("playerTwoId is required unless isAiGame = true");
    }

    return this.gameService.create(playerOneId, playerTwoId, isAiGame, playerOneElo, playerTwoElo);
  }

  @Post('stream')
  async createStream(@Req() req: Request) {
    const readable = Readable.from(req as any);

    const rl = readline.createInterface({
      input: readable,
      terminal: false,
    });

    let count = 0;

    rl.on('line', (line) => {
      if (!line.trim()) return;

      try {
        const gameObject = JSON.parse(line);
        
        if (!gameObject.isAiGame && !gameObject.playerTwoId) {
             console.error("Error in object:", gameObject.id);
             return;
        }

        this.gameService.create(
          gameObject.playerOneId, 
          gameObject.playerTwoId, 
          gameObject.isAiGame,
          gameObject.playerOneElo,
          gameObject.playerTwoElo
        );
        
        count++;
      } catch (e) {
        console.error('Error parsing the stream object', e);
      }
    });

    return new Promise((resolve) => {
      rl.on('close', () => {
        console.log(`${count} have been processed.`);
        resolve({ processed: count });
      });
    });
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
