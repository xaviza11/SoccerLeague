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
  Req,
} from "@nestjs/common";
import { MarketPlayersService } from "./market_players.service";
import { AuthGuard } from "../../guards/auth.guard";

@Controller("market-players")
export class MarketPlayersController {
  constructor(private readonly marketPlayersService: MarketPlayersService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req: any, @Body() body: { player_id: string; price: number }) {
    if (!body.player_id || body.price === undefined) {
      throw new BadRequestException("Missing required fields");
    }
    return this.marketPlayersService.create({ ...body, seller_id: req.user.id });
  }

  @Get()
  findAll() {
    return this.marketPlayersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.marketPlayersService.findOne(id);
  }

  @Get("seller/:id")
  findBySeller(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.marketPlayersService.findBySeller(id);
  }

  @Patch(":id/price")
  @UseGuards(AuthGuard)
  updatePrice(
    @Req() req: any,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body("price") price: number,
  ) {
    if (price === undefined) throw new BadRequestException("Price is required");
    return this.marketPlayersService.updatePrice(id, price, req.user.id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.marketPlayersService.remove(id);
  }
}
