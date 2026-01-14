import { Controller, Get, Post, Param, Delete, UseGuards, ParseUUIDPipe } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorators/user.decorator";

@Controller("cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@User("id") userId: string) {
    return this.cardsService.create(userId);
  }

  @Get()
  async findAll() {
    return this.cardsService.findAll();
  }

  @Get("user")
  @UseGuards(AuthGuard)
  async findAllByUser(@User("id") userId: string) {
    return this.cardsService.findAllByUser(userId);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async findOne(@Param("id", new ParseUUIDPipe()) id: string, @User("id") userId: string) {
    return this.cardsService.findOne(id, userId);
  }

  @Delete(":id")
  async delete(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.cardsService.delete(id);
  }
}
