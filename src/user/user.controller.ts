import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@Req() req) {
    return req.user;
  }
}
