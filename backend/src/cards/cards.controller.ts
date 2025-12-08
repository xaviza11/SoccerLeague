import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Delete,
  UseGuards,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(@Req() req) {
    return this.cardsService.create(req.user.id);
  }

  @Get()
  async findAll() {
    return this.cardsService.findAll();
  }

  @Get('user')
  async findAllByUser(@Req() req) {
    return this.cardsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req) {
    return this.cardsService.findOne(id, req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string, @Req() req) {
    return this.cardsService.delete(id, req.user.id);
  }
}
