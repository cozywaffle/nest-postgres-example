import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto, RegDto } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async createUser(dto: RegDto): Promise<object> {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          login: dto.login,
          username: dto.username,
          hash,
        },
      });

      return this.signToken(user.id, user.login);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials are taken');
        }
      }
      throw error;
    }
  }

  async signIn(dto: AuthDto): Promise<object> {
    const user = await this.prisma.user.findUnique({
      where: {
        login: dto.login,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) throw new ForbiddenException('Credentials are incorrect');

    return this.signToken(user.id, user.login);
  }

  async signToken(id: number, login: string): Promise<object> {
    const payload = {
      sub: id,
      login,
    };

    const secret = this.config.get('SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '31d',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
