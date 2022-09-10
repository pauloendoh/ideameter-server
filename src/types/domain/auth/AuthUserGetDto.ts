import { Profile, User } from "@prisma/client";

// PE 3/3
export class AuthUserGetDto {
  id: string;
  username: string;
  email: string;

  token: string;
  expiresAt: Date;
  profile: Profile;

  constructor(user: User, profile: Profile, token: string, expiresAt: Date) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;

    this.profile = profile;

    this.token = token;
    this.expiresAt = expiresAt;
  }
}
