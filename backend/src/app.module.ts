import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersStorageModule } from './users_storage/users_storage.module';
import { UsersGameStatsModule } from './users_game_stats/users_game_stats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    UsersModule,
    UsersStorageModule,
    UsersGameStatsModule,
    PlayerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
