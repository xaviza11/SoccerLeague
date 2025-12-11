import { Module } from '@nestjs/common';
import { MarketAurasController } from './market_auras.controller';
import { MarketAurasService } from './market_auras.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aura, MarketAura, User } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([MarketAura, User, Aura])],
  controllers: [MarketAurasController],
  providers: [MarketAurasService]
})
export class MarketAurasModule {}
