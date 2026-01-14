import { Controller, Post, Body, Delete, Get, UseGuards, Param } from "@nestjs/common";
import { UsersStorageService } from "./users_storage.service";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorators/user.decorator";

@Controller("users-storage")
export class UsersStorageController {
  constructor(private readonly usersStorageService: UsersStorageService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createStorage(@User("id") userId: string) {
    return this.usersStorageService.createStorage(userId);
  }

  @Post("positions-change")
  async addPositionCard(@Body("card") card: string, @Body("storageId") storageId: string) {
    return this.usersStorageService.addPositionChangeCard(storageId, card);
  }

  @Post("cards")
  async addCard(@Body("card") card: string, @Body("storageId") storageId: string) {
    return this.usersStorageService.addCard(storageId, card);
  }

  @Post("team")
  @UseGuards(AuthGuard)
  async addTeam(
    @User("id") userId: string,
    @Body("teamId") teamId: string,
    @Body("storageId") storageId: string,
  ) {
    return this.usersStorageService.addTeam(userId, teamId, storageId);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteStorage(@User("id") userId: string, @Body("storageId") storageId: string) {
    return this.usersStorageService.deleteStorage(userId, storageId);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async findOne(@Param("id") id: string) {
    return this.usersStorageService.findOne(id);
  }

  @Get("all")
  @UseGuards(AuthGuard)
  async findAll() {
    return this.usersStorageService.findAll();
  }
}
