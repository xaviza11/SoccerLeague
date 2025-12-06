import { Module } from '@nestjs/common';
import { UsersStorageController } from './users_storage.controller';
import { UsersStorageService } from './users_storage.service';
import { Storage, Card, PositionChangeCard, Team } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Storage, Card, PositionChangeCard, Team])],
  controllers: [UsersStorageController],
  providers: [UsersStorageService],
})
export class UsersStorageModule {}
