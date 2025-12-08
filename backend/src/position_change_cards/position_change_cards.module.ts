import { Module } from '@nestjs/common';
import { PositionChangeCardsController } from './position_change_cards.controller';
import { PositionChangeCardsService } from './position_change_cards.service';

@Module({
  controllers: [PositionChangeCardsController],
  providers: [PositionChangeCardsService]
})
export class PositionChangeCardsModule {}
