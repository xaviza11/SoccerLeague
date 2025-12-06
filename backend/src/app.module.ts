import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersStorageModule } from './users_storage/users_storage.module';
import { UsersGameStatsModule } from './users_game_stats/users_game_stats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from './player/player.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    UsersStorageModule,
    UsersGameStatsModule,
    PlayerModule,
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
      global: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
