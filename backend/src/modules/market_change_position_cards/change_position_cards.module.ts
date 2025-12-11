import { Module } from '@nestjs/common';
import { MarketPositionChangeCardsController } from './change_position_cards.controller';
import { MarketPositionChangeCardsService } from './change_position_cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, MarketPositionChangeCard, PositionChangeCard } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, MarketPositionChangeCard, PositionChangeCard])],
  controllers: [MarketPositionChangeCardsController],
  providers: [MarketPositionChangeCardsService]
})
export class ChangePositionCardsModule {}
