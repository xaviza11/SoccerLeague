import { Module } from "@nestjs/common";
import { MarketCardsController } from "./market_cards.controller";
import { MarketCardsService } from "./market_cards.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MarketCard, User, Card } from "src/entities";

@Module({
  imports: [TypeOrmModule.forFeature([User, MarketCard, Card])],
  controllers: [MarketCardsController],
  providers: [MarketCardsService],
})
export class MarketCardsModule {}
