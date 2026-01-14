import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { PositionChangeCardsService } from "./position_change_cards.service";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorators/user.decorator";

@UseGuards(AuthGuard)
@Controller("position-change-cards")
export class PositionChangeCardsController {
  constructor(private readonly positionsChangeCardService: PositionChangeCardsService) {}

  @Post()
  async create(@Body("storageId", new ParseUUIDPipe()) storageId: string, @User("id") userId: string) {
    if (!storageId) {
      throw new BadRequestException("storageId is required");
    }

    return this.positionsChangeCardService.create(storageId, userId);
  }

  @Get()
  async findAll() {
    return this.positionsChangeCardService.findAll();
  }

  @Get("user")
  async findAllByUser(@User("id") userId: string) {
    return this.positionsChangeCardService.findAllByUser(userId);
  }

  @Get(":id")
  async findOne(@Param("id", new ParseUUIDPipe()) id: string, @User("id") userId: string) {
    return this.positionsChangeCardService.findOne(id, userId);
  }

  @Delete(":id")
  async deleteOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.positionsChangeCardService.deleteOne(id);
  }
}
