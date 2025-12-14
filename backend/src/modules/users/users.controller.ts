import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  create(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.createUser(body.name, body.email, body.password);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.usersService.login(body.email, body.password);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('search/name/:name')
  async searchByName(@Param('name') name: string) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Name cannot be empty - CRUD');
    }
    return this.usersService.searchUsersByName(name);
  }

  @Get('')
  async getAll() {
    return this.usersService.findAll();
  }

  @Put('')
  @UseGuards(AuthGuard)
  update(
    @Req() req,
    @Body()
    body: {
      name?: string;
      email?: string;
      password?: string;
      currentPassword: string;
    },
  ) {
    if (!body.currentPassword) {
      throw new BadRequestException('Current password is required - CRUD');
    }
    return this.usersService.updateUser(req.user.sub, body);
  }

  @Delete('')
  @UseGuards(AuthGuard)
  delete(@Req() req, @Body() body: { currentPassword: string }) {
    if (!body.currentPassword) {
      throw new BadRequestException('Current password is required - CRUD');
    }
    return this.usersService.deleteUser(req.user.sub);
  }
}
