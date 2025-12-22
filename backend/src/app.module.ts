import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { UsersStorageModule } from './modules/users_storage/users_storage.module';
import { UsersGameStatsModule } from './modules/users_game_stats/users_game_stats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from './modules/player/player.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CardsModule } from './modules/cards/cards.module';
import { AurasModule } from './modules/auras/auras.module';
import { PlayedGamesModule } from './modules/played_games/played_games.module';
import { MarketAurasModule } from './modules/market_auras/market_auras.module';
import { MarketCardsModule } from './modules/market_cards/market_cards.module';
import { MarketPlayersModule } from './modules/market_players/market_players.module';
import { ChangePositionCardsModule } from './modules/market_change_position_cards/change_position_cards.module';
import { TeamsModule } from './modules/teams/teams.module';

@Module({
  imports: [
    UsersModule,
    UsersStorageModule,
    UsersGameStatsModule,
    PlayerModule,
    CardsModule,
    AurasModule,
    PlayedGamesModule,
    MarketAurasModule,
    MarketCardsModule,
    MarketPlayersModule,
    ChangePositionCardsModule,
    TeamsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
