import { Module } from '@nestjs/common';
import { AurasService } from './auras.service';
import { AurasController } from './auras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card, User, Storage } from '../entities'

@Module({
  imports: [TypeOrmModule.forFeature([Card, User, Storage])],
  providers: [AurasService],
  controllers: [AurasController]
})
export class AurasModule {}
