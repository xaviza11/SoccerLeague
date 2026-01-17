import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { MarketCardsService } from "./market_cards.service";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorators/user.decorator";

@Controller("market-cards")
export class MarketCardsController {
  constructor(private readonly marketCardsService: MarketCardsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@User("sub") userId: string, @Body() body: { card_id: string; price: number }) {
    if (!body.card_id || body.price === undefined) {
      throw new BadRequestException("Missing required fields");
    }
    return this.marketCardsService.create({ ...body, seller_id: userId });
  }

  @Get()
  findAll() {
    return this.marketCardsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.marketCardsService.findOne(id);
  }

  @Get("seller/:id")
  findBySeller(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.marketCardsService.findBySeller(id);
  }

  @Patch(":id/price")
  @UseGuards(AuthGuard)
  updatePrice(
    @User("sub") userId: string,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body("price") price: number,
  ) {
    if (price === undefined) throw new BadRequestException("Price is required");
    return this.marketCardsService.updatePrice(id, price, userId);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.marketCardsService.remove(id);
  }
}
