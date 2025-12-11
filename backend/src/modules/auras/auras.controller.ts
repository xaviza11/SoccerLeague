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
import { AurasService } from './auras.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('auras')
export class AurasController {
  constructor(private readonly aurasService: AurasService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() req) {
    return this.aurasService.create(req.user.id);
  }

  @Get()
  async findAll() {
    return this.aurasService.findAll();
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async findAllByUser(@Req() req) {
    return this.aurasService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
  ) {
    return this.aurasService.findOne(id, req.user.id);
  }

  @Delete(':id')
  async deleteOne(
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    return this.aurasService.delete(id);
  }
}
