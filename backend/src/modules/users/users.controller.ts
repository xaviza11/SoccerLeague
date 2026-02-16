import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
  StreamableFile,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorators/user.decorator";
import { Readable, Transform } from "node:stream";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("")
  create(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.createUser(body.name, body.email, body.password);
  }

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body.email, body.password);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  async findMe(@User("sub") userId: string) {
    return this.usersService.findOne(userId);
  }

  @Get("search/id/:id")
  @UseGuards(AuthGuard)
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }
  
  @Get("search/name/:name")
  async searchByName(@Param("name") name: string) {
    if (!name || name.trim() === "") {
      throw new BadRequestException("Name cannot be empty - CRUD");
    }
    return this.usersService.searchUsersByName(name);
  }
  
  @Get("all")
  async getUsers(
    @Query("page") page: number = 0,
    @Query("pageSize") pageSize: number = 50,
  ) {
    const users = await this.usersService.findAll(
      Number(page),
      Number(pageSize),
    );
    return users;
  }

  @Put("")
  @UseGuards(AuthGuard)
  update(
    @User("sub") userId: string,
    @Body()
    body: {
      name?: string;
      email?: string;
      password?: string;
      currentPassword: string;
    },
  ) {
    if (!body.currentPassword) {
      throw new BadRequestException("Current password is required - CRUD");
    }
    return this.usersService.updateUser(userId, body);
  }

  @Delete("")
  @UseGuards(AuthGuard)
  delete(
    @User("sub") userId: string,
    @Body() body: { currentPassword: string },
  ) {
    if (!body.currentPassword) {
      throw new BadRequestException("Current password is required - CRUD");
    }
    return this.usersService.deleteUser(userId, body.currentPassword);
  }
}
