import { Module } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { Team, User, Storage } from "../../entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamsController } from "./teams.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Team, Storage, User])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
