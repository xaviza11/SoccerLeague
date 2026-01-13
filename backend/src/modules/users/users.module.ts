import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User, Storage, UserStats } from "../../entities";

import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([User, Storage, UserStats])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
