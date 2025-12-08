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
import { PositionChangeCardsService } from './position_change_cards.service';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('position-change-cards')
export class PositionChangeCardsController {
  constructor(private readonly positionsChangeCardService: PositionChangeCardsService) {}

  @Post()
  async create(@Body('storageId', new ParseUUIDPipe()) storageId: string, @Req() req) {
    if (!storageId) {
      throw new BadRequestException('storageId is required');
    }

    return this.positionsChangeCardService.create(storageId, req.user.id);
  }

  @Get()
  async findAll() {
    return this.positionsChangeCardService.findAll();
  }

  @Get('user')
  async findAllByUser(@Req() req) {
    return this.positionsChangeCardService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req) {
    return this.positionsChangeCardService.findOne(id, req.user.id);
  }

  @Delete(':id')
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req) {
    return this.positionsChangeCardService.deleteOne(id, req.user.id);
  }
}
