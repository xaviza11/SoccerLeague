import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Team } from '../../entities'
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsController } from './teams.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  controllers: [TeamsController],
  providers: [TeamsService]
})
export class TeamsModule {}


