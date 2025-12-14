import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { validatePassword, validateEmail } from '../../validators';

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
  ): Promise<any> {
    if (name.length === 0)
      throw new BadRequestException(
        'Name must have almost one character  - CRUD',
      );

    if (!validateEmail(email)) {
      throw new BadRequestException('Invalid email format - CRUD');
    }

    if (!validatePassword(password)) {
      throw new BadRequestException(
        'The password must be at least 8 characters long, include uppercase, lowercase and a number. - CRUD',
      );
    }

    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email is already in use - CRUD');
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

    const saved = await this.usersRepo.save(newUser);

    const { password: p, recovery_password, ...safeUser } = saved;
    return safeUser;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; name: string }> {
    if (!validateEmail(email)) {
      throw new BadRequestException('Invalid email format - CRUD');
    }

    if (!validatePassword(password)) {
      throw new BadRequestException(
        'The password must be at least 8 characters long, include uppercase, lowercase and a number. - CRUD',
      );
    }

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Invalid credentials - CRUD');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials - CRUD');

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, name: user.name };
  }

  async findAll(): Promise<any[]> {
    const users = await this.usersRepo.find();

    return users.map((u) => {
      const { password, recovery_password, ...safeUser } = u;
      return safeUser;
    });
  }

  async searchUsersByName(name: string): Promise<any[]> {
    if (name.length === 0)
      throw new BadRequestException(
        'Name must have almost one character  - CRUD',
      );

    const users = await this.usersRepo.find({
      where: { name },
      take: 20,
    });

    return users.map((u) => {
      const { password, recovery_password, ...safeUser } = u;
      return safeUser;
    });
  }

  async findOne(id: string): Promise<any> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found - CRUD`);
    }

    const { password, recovery_password, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(
    id: string,
    updates: {
      name?: string;
      email?: string;
      password?: string;
      currentPassword: string;
    },
  ): Promise<any> {
    if (updates.name) {
      if (updates.name.length === 0)
        throw new BadRequestException(
          'Name must have almost one character  - CRUD',
        );
    }

    if (updates.email) {
      if (!validateEmail(updates.email)) {
        throw new BadRequestException('Invalid email format - CRUD');
      }
    }

    if (updates.password) {
      if (!validatePassword(updates.password)) {
        throw new BadRequestException(
          'The password must be at least 8 characters long, include uppercase, lowercase and a number. - CRUD',
        );
      }
    }

    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found - CRUD`);
    }

    const isMatch = await bcrypt.compare(
      updates.currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect - CRUD');
    }

    if (updates.email) {
      const exists = await this.usersRepo.findOne({
        where: { email: updates.email },
      });
      if (exists && exists.id !== id) {
        throw new BadRequestException('Email already in use - CRUD');
      }
      user.email = updates.email;
    }

    if (updates.name) user.name = updates.name;

    if (updates.password) {
      user.password = await bcrypt.hash(updates.password, 10);
    }

    const updated = await this.usersRepo.save(user);

    const { password, recovery_password, ...safeUser } = updated;
    return safeUser;
  }

  async deleteUser(id: string, currentPassword?: string): Promise<void> {
    if (currentPassword) {
      if (!validatePassword(currentPassword)) {
        throw new BadRequestException(
          'The password must be at least 8 characters long, include uppercase, lowercase and a number. - CRUD',
        );
      }
    }

    const user = await this.usersRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found - CRUD`);
    }

    if (!currentPassword) {
      throw new BadRequestException('Current password is required - CRUD');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect - CRUD');
    }

    const result = await this.usersRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found - CRUD`);
    }
  }
}
