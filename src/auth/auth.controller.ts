import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/me')
  getMe(@Body() dto: User) {
    return this.service.user({ id: dto.id });
  }

  @Post('/logup')
  logup(@Body() dto: User) {
    return this.service.createUser(dto);
  }
}
