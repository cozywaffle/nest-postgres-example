import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegDto } from './dto/auth.dto';

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
}
