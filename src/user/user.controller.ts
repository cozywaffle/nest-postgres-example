import { Body, Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDualDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  getMe(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Delete('/delete')
  deleteUser(@Body() dto: UserDualDto) {
    return this.service.deleteUser(dto.login, dto.password);
  }
}
