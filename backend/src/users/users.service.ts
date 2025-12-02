import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existing = await this.usersRepo.findOne({ where: { email } });

    if (existing) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const rawRecovery = Math.random().toString(36).substring(2, 10);
    const hashedRecovery = await bcrypt.hash(rawRecovery, 10);

    const newUser = this.usersRepo.create({
      name,
      email,
      password: hashedPassword,
      recovery_password: hashedRecovery,
    });

    return this.usersRepo.save(newUser);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; name: string }> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, name: user.name };
  }

  /*async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }*/

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUser(
    id: string,
    updates: {
      name?: string;
      email?: string;
      password?: string;
      currentPassword: string;
    },
  ): Promise<User> {
    const user = await this.findOne(id);

    const isMatch = await bcrypt.compare(
      updates.currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (updates.email) {
      const exists = await this.usersRepo.findOne({
        where: { email: updates.email },
      });
      if (exists && exists.id !== id) {
        throw new BadRequestException('Email already in use');
      }
      user.email = updates.email;
    }

    if (updates.name) user.name = updates.name;

    if (updates.password) {
      user.password = await bcrypt.hash(updates.password, 10);
    }

    return this.usersRepo.save(user);
  }

  async deleteUser(id: string, currentPassword?: string): Promise<void> {
    const user = await this.findOne(id);

    if (!currentPassword) {
      throw new BadRequestException('Current password is required');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const result = await this.usersRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
