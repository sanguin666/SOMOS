import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { Language } from '../common/enums/language.enum.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // The one place the password hash is read. Everything else gets a User
  // without it — see the column's `select: false`.
  findByEmailForLogin(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: { id: true, email: true, passwordHash: true },
    });
  }

  /**
   * The congregant side of signing in: a phone number that verifies for the
   * first time becomes an account right there, with no separate sign-up
   * step. `firstName` is only written on that first sign-in — someone who
   * already has an account keeps the name they set, so re-verifying on a
   * new phone can't quietly rename them.
   */
  async findOrCreateByPhone(phone: string, firstName?: string): Promise<User> {
    const existing = await this.findByPhone(phone);
    if (existing) {
      return existing;
    }
    return this.usersRepository.save(
      this.usersRepository.create({ phone, firstName }),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async updateLanguage(id: string, language: Language): Promise<User> {
    const user = await this.findOne(id);
    user.language = language;
    return this.usersRepository.save(user);
  }
}
