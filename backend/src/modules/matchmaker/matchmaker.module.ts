import { Module } from '@nestjs/common';
import { MatchmakerController } from './matchmaker.controller';
import { MatchmakerService } from './matchmaker.service';
import SimulatorApiClient from './utils/SimulatorApiClient';

import { User, Game, Team, GameHistory } from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User, Game, Team, GameHistory])],
    providers: [MatchmakerService, SimulatorApiClient],
    controllers: [MatchmakerController]
})
export class MatchmakerModule {}

