import { Controller, Get, Post, Param, Delete, UseGuards, ParseUUIDPipe } from "@nestjs/common";
import { AurasService } from "./auras.service";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorators/user.decorator";

@Controller("auras")
export class AurasController {
  constructor(private readonly aurasService: AurasService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@User("id") userId: string) {
    return this.aurasService.create(userId);
  }

  @Get()
  async findAll() {
    return this.aurasService.findAll();
  }

  @Get("user")
  @UseGuards(AuthGuard)
  async findAllByUser(@User("id") userId: string) {
    return this.aurasService.findAllByUser(userId);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async findOne(@Param("id", new ParseUUIDPipe()) id: string, @User("id") userId: string) {
    return this.aurasService.findOne(id, userId);
  }

  @Delete(":id")
  async deleteOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.aurasService.delete(id);
  }
}
