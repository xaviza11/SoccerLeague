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
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('auras')
export class AurasController {
  constructor(private readonly aurasService: AurasService) {}

  @Post()
  async create(@Req() req) {
    return this.aurasService.create(req.user.id);
  }

  @Get()
  async findAll() {
    return this.aurasService.findAll();
  }

  @Get('user')
  async findAllByUser(@Req() req) {
    return this.aurasService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
  ) {
    return this.aurasService.findOne(id, req.user.id);
  }

  @Delete(':id')
  async deleteOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req,
  ) {
    return this.aurasService.delete(id, req.user.id);
  }
}
