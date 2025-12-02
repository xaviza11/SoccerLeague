import { Module } from '@nestjs/common';
import { UsersStorageController } from './users_storage.controller';
import { UsersStorageService } from './users_storage.service';
import { Storage } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Storage])],
  controllers: [UsersStorageController],
  providers: [UsersStorageService],
})
export class UsersStorageModule {}
