import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  //login and password params for confirming deleting
  async deleteUser(login: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          login,
        },
      });

      if (!user) throw new ForbiddenException('Incorrect credentials!');

      const pwMatches = argon2.verify(user.hash, password);

      if (!pwMatches) throw new ForbiddenException('Incorrect credentials!');

      const deleted_user = await this.prisma.user.delete({
        where: { login: user.login, hash: user.hash, id: user.id },
      });

      return deleted_user;
    } catch (error) {
      throw new error(error);
    }
  }
}
