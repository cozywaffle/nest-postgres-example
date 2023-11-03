import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegDto } from './dto/auth.dto';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/register')
  signUp(@Body() dto: RegDto) {
    return this.service.createUser(dto);
  }

  @Post('/login')
  signIn(@Body() dto: AuthDto) {
    return this.service.signIn(dto);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
