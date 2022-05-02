import { User } from "@prisma/client";

// PE 3/3
export class AuthUserGetDto {
  id: string;
  username: string;
  email: string;

  token: string;
  expiresAt: Date;

  constructor(user: User, token: string, expiresAt: Date) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;

    this.token = token;
    this.expiresAt = expiresAt;
  }
}
