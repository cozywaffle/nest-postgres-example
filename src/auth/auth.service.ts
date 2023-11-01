import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto, RegDto } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: RegDto): Promise<User> {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          login: dto.login,
          username: dto.username,
          hash,
        },
      });

      delete user.hash;

      return user as User;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials are taken',
          );
        }
      }
      throw error;
    }
  }

  async signIn(dto: AuthDto): Promise<User> {
    const user =
      await this.prisma.user.findUnique({
        where: {
          login: dto.login,
        },
      });

    if (!user)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );

    if (!pwMatches)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    delete user.hash;

    return user as User;
  }
}
