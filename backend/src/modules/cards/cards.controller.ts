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
} from "@nestjs/common";
import { CardsService } from "./cards.service";
import { AuthGuard } from "../../guards/auth.guard";

@Controller("cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() req) {
    return this.cardsService.create(req.user.id);
  }

  @Get()
  async findAll() {
    return this.cardsService.findAll();
  }

  @Get("user")
  @UseGuards(AuthGuard)
  async findAllByUser(@Req() req) {
    return this.cardsService.findAllByUser(req.user.id);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async findOne(@Param("id", new ParseUUIDPipe()) id: string, @Req() req) {
    return this.cardsService.findOne(id, req.user.id);
  }

  @Delete(":id")
  async delete(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.cardsService.delete(id);
  }
}
