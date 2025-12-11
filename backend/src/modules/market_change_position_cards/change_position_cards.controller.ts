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
} from '@nestjs/common';
import { MarketPositionChangeCardsService } from './change_position_cards.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('market-position-change-cards')
export class MarketPositionChangeCardsController {
  constructor(
    private readonly marketCardsService: MarketPositionChangeCardsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Req() req: any,
    @Body() body: { position_change_card_id: string; price: number },
  ) {
    if (!body.position_change_card_id || body.price === undefined) {
      throw new BadRequestException('Missing required fields');
    }
    return this.marketCardsService.create({ ...body, seller_id: req.user.id });
  }

  @Get()
  findAll() {
    return this.marketCardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.marketCardsService.findOne(id);
  }

  @Get('seller/:id')
  findBySeller(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.marketCardsService.findBySeller(id);
  }

  @Patch(':id/price')
  @UseGuards(AuthGuard)
  updatePrice(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('price') price: number,
  ) {
    if (price === undefined) throw new BadRequestException('Price is required');
    return this.marketCardsService.updatePrice(id, price, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.marketCardsService.remove(id);
  }
}
