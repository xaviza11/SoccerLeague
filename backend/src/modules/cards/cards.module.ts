import { Module } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Card, User, Storage } from "../../entities";

@Module({
  imports: [TypeOrmModule.forFeature([Card, User, Storage])],
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}
