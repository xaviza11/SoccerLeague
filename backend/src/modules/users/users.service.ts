import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserStats } from "../../entities";
import { validatePassword, validateEmail } from "../../validators";
import { Logger } from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(UserStats)
    private readonly userStatsRepo: Repository<UserStats>,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async createUser(name: string, email: string, password: string): Promise<any> {
    this.logger.log(`Creating user with email: ${email} and name: ${name}`);
    if (name.length === 0) {
      this.logger.log(`Failed to create user: Name is empty`);
      throw new BadRequestException("Name must have almost one character  - CRUD");
    }

    if (!validateEmail(email)) {
      this.logger.log(`Failed to create user: Invalid email format`);
      throw new BadRequestException("Invalid email format - CRUD");
    }

    if (!validatePassword(password)) {
      this.logger.log(`Failed to create user: Invalid password format`);
      throw new BadRequestException(
        "The password must be at least 8 characters long, include uppercase, lowercase and a number. - CRUD",
      );
    }

    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) {
      this.logger.log(`Failed to create user: Email already in use`);
      throw new BadRequestException("Email is already in use - CRUD");
    }

    const existingName = await this.usersRepo.findOne({ where: { name } });
    if (existingName) {
      this.logger.log(`Failed to create user: Name already in use`);
      throw new BadRequestException("Name is already in use - CRUD");
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

    this.logger.log(`User created successfully with ID: ${saved.id}`);

    const { password: p, recovery_password, ...safeUser } = saved;
    return safeUser;
  }

  async login(email: string, password: string): Promise<{ accessToken: string; name: string }> {
    this.logger.log(`Attempting login for email: ${email}`);
    if (!validateEmail(email)) {
      this.logger.log(`Failed login: Invalid email format`);
      throw new BadRequestException("Invalid email format - CRUD");
    }

    if (!validatePassword(password)) {
      this.logger.log(`Failed login: Invalid password format`);
      throw new BadRequestException(
        "The password must be at least 8 characters long, include uppercase, lowercase and a number. - CRUD",
      );
    }

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      this.logger.log(`Failed login: User not found`);
      throw new BadRequestException("Invalid credentials - CRUD");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      this.logger.log(`Failed login: Incorrect password`);
      throw new BadRequestException("Invalid credentials - CRUD");
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Login successful for user ID: ${user.id}`);
    return { accessToken, name: user.name };
  }

  async findAll(): Promise<any[]> {
    this.logger.log(`Retrieving all users`);
    const users = await this.usersRepo.find();

    this.logger.log(`Total users found: ${users.length}`);
    return users.map((u) => {
      const { password, recovery_password, ...safeUser } = u;
      return safeUser;
    });
  }

  async searchUsersByName(name: string): Promise<any[]> {
    this.logger.log(`Searching users by name: ${name}`);
    if (name.length === 0) {
      this.logger.log(`Failed search: Name is empty`);
      throw new BadRequestException("Name must have almost one character  - CRUD");
    }

    const users = await this.usersRepo.find({
      where: { name },
      take: 20,
    });

    this.logger.log(`Users found with name "${name}": ${users.length}`);

    return users.map((u) => {
      const { password, recovery_password, ...safeUser } = u;
      return safeUser;
    });
  }

  async findOne(id: string): Promise<any> {
    this.logger.log(`Retrieving user with ID: ${id}`);
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ["storage", "stats"],
    });

    if (!user) {
      this.logger.log(`User not found with ID: ${id}`);
      throw new NotFoundException(`User with id ${id} not found - CRUD`);
    }

    const { password, recovery_password, ...safeUser } = user;

    this.logger.log(`User retrieved successfully with ID: ${id}`);
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
    this.logger.log(`Updating user with ID: ${id}`);
    if (updates.name) {
      if (updates.name.length === 0) this.logger.log(`Failed to update user: Name is empty`);
      throw new BadRequestException("Name must have almost one character  - CRUD");
    }

    if (updates.email) {
      if (!validateEmail(updates.email)) {
        this.logger.log(`Failed to update user: Invalid email format`);
        throw new BadRequestException("Invalid email format - CRUD");
      }
    }

    if (updates.password) {
      if (!validatePassword(updates.password)) {
        this.logger.log(`Failed to update user: Invalid password format`);
        throw new BadRequestException(
          "The password must be at least 8 characters long, include uppercase, lowercase and a number. - CRUD",
        );
      }
    }

    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      this.logger.log(`Failed to update user: User not found with ID: ${id}`);
      throw new NotFoundException(`User with id ${id} not found - CRUD`);
    }

    const isMatch = await bcrypt.compare(updates.currentPassword, user.password);

    if (!isMatch) {
      this.logger.log(`Failed to update user: Incorrect current password`);
      throw new BadRequestException("Current password is incorrect - CRUD");
    }

    if (updates.email) {
      const exists = await this.usersRepo.findOne({
        where: { email: updates.email },
      });
      if (exists && exists.id !== id) {
        this.logger.log(`Failed to update user: Email already in use`);
        throw new BadRequestException("Email already in use - CRUD");
      }
      user.email = updates.email;
    }

    if (updates.name) user.name = updates.name;

    if (updates.password) {
      user.password = await bcrypt.hash(updates.password, 10);
    }

    const updated = await this.usersRepo.save(user);

    this.logger.log(`User updated successfully with ID: ${id}`);

    const { password, recovery_password, ...safeUser } = updated;
    return safeUser;
  }

  async deleteUser(id: string, currentPassword?: string): Promise<void> {
    this.logger.log(`Deleting user with ID: ${id}`);
    if (currentPassword) {
      if (!validatePassword(currentPassword)) {
        this.logger.log(`Failed to delete user: Invalid password format`);
        throw new BadRequestException(
          "The password must be at least 8 characters long, include uppercase, lowercase and a number. - CRUD",
        );
      }
    }

    const user = await this.usersRepo.findOne({ where: { id } });

    if (!user) {
      this.logger.log(`Failed to delete user: User not found with ID: ${id}`);
      throw new NotFoundException(`User with id ${id} not found - CRUD`);
    }

    if (!currentPassword) {
      this.logger.log(`Failed to delete user: Current password is required`);
      throw new BadRequestException("Current password is required - CRUD");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      this.logger.log(`Failed to delete user: Incorrect current password`);
      throw new BadRequestException("Current password is incorrect - CRUD");
    }

    const result = await this.usersRepo.delete(id);
    if (result.affected === 0) {
      this.logger.log(`Failed to delete user: User not found with ID: ${id}`);
      throw new NotFoundException(`User with id ${id} not found - CRUD`);
    }
  }
}
