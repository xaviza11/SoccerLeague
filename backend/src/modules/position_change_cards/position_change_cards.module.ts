import { Module } from '@nestjs/common';
import { PositionChangeCardsController } from './position_change_cards.controller';
import { PositionChangeCardsService } from './position_change_cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [PositionChangeCardsController],
  providers: [PositionChangeCardsService],
})
export class PositionChangeCardsModule {}
