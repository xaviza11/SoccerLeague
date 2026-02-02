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

  @Get("search/name/:name")
  async searchByName(@Param("name") name: string) {
    if (!name || name.trim() === "") {
      throw new BadRequestException("Name cannot be empty - CRUD");
    }
    return this.usersService.searchUsersByName(name);
  }

  @Get("stream")
  async getStream(
    @Query("lastId") lastId: string = "x",
  ): Promise<StreamableFile> {
    const pgStream = await this.usersService.findAll(lastId);

    const readableStream =
      pgStream instanceof Readable ? pgStream : Readable.from(pgStream);

    const stringifier = new Transform({
      writableObjectMode: true,
      transform(user, encoding, callback) {
        callback(null, JSON.stringify(user) + "\n");
      },
    });

    const pipeline = readableStream.pipe(stringifier);

    return new StreamableFile(pipeline, {
      type: "application/x-ndjson",
      disposition: 'attachment; filename="users.jsonl"',
    });
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
