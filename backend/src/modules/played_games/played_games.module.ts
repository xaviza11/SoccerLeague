import { Module } from "@nestjs/common";
import { PlayedGamesService } from "./played_games.service";
import { PlayedGamesController } from "./played_games.controller";

import { GameHistory, User } from "../../entities";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([GameHistory, User])],
  providers: [PlayedGamesService],
  controllers: [PlayedGamesController],
})
export class PlayedGamesModule {}
