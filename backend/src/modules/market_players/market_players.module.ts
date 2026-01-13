import { Module } from "@nestjs/common";
import { MarketPlayersController } from "./market_players.controller";
import { MarketPlayersService } from "./market_players.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MarketPlayer, Player, User } from "../../entities";

@Module({
  imports: [TypeOrmModule.forFeature([User, MarketPlayer, Player])],
  controllers: [MarketPlayersController],
  providers: [MarketPlayersService],
})
export class MarketPlayersModule {}
