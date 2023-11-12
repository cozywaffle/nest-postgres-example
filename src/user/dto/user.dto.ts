import { IsNotEmpty, IsString } from 'class-validator';

export class UserDualDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
