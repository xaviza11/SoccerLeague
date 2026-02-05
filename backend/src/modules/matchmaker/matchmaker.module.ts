import { Module } from '@nestjs/common';
import { MatchmakerController } from './matchmaker.controller';
import { MatchmakerService } from './matchmaker.service';

import { User, Game } from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User, Game])],
    providers: [MatchmakerService],
    controllers: [MatchmakerController]
})
export class MatchmakerModule {}

