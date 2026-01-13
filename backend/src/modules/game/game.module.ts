import { Module } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameController } from "./game.controller";

import { TypeOrmModule } from "@nestjs/typeorm";

import { Game, User } from "../../entities";

@Module({
  imports: [TypeOrmModule.forFeature([Game, User])],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
