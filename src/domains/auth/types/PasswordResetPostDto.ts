import { IsString } from "class-validator";

export class PasswordResetPostDto {
  @IsString()
  userId: string;

  @IsString()
  token: string;

  @IsString()
  password: string;

  @IsString()
  password2: string;
}
