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
import { MarketAurasService } from "./market_auras.service";
import { AuthGuard } from "../../guards/auth.guard";

@Controller("market-auras")
export class MarketAurasController {
  constructor(private readonly marketAurasService: MarketAurasService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: { aura_id: string; price: number }) {
    const seller_id = req.user.id;
    if (!body.aura_id || body.price === undefined) {
      throw new BadRequestException("Missing required fields");
    }
    return this.marketAurasService.create({ ...body, seller_id });
  }

  @Get()
  findAll() {
    return this.marketAurasService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.marketAurasService.findOne(id);
  }

  @Get("seller/:id")
  findBySeller(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.marketAurasService.findBySeller(id);
  }

  @UseGuards(AuthGuard)
  @Patch(":id/price")
  updatePrice(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body("price") price: number,
    @Req() req: any,
  ) {
    if (price === undefined) throw new BadRequestException("Price is required");
    const userId = req.user.id;
    return this.marketAurasService.updatePrice(id, price, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.marketAurasService.remove(id);
  }
}
