import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SelfGuard } from '../auth/guards/self.guard.js';

/**
 * Everything here is about one person's own account, so every route is
 * behind "you are that person".
 *
 * Two routes that used to live here are gone rather than guarded:
 * `GET /users`, which returned every account in the system to anyone who
 * asked, and `POST /users`, which let anyone create one. Accounts now come
 * into existence by signing in — see auth/phone-auth.service.ts — and
 * nothing in the app or the dashboard ever called either route.
 */
@Controller('users')
@UseGuards(JwtAuthGuard, SelfGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
