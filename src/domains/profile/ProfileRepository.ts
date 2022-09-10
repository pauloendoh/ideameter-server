import { AuthUserGetDto } from "../../types/domain/auth/AuthUserGetDto";
import myPrismaClient from "../../utils/myPrismaClient";
import UserRepository from "../user/UserRepository";

export class ProfileRepository {
  constructor(
    private profilePrisma = myPrismaClient.profile,
    private userRepo = new UserRepository()
  ) {}

  findProfileByUserId(userId: string) {
    return this.profilePrisma.findFirst({
      where: {
        userId,
      },
    });
  }

  async updatePicture(userId: string, pictureUrl: string) {
    const user = await this.userRepo.findById(userId);

    const profile = await this.profilePrisma.upsert({
      create: {
        pictureUrl,
        bio: "",
        userId,
      },
      update: {
        pictureUrl,
      },
      where: {
        userId,
      },
    });

    // PE 2/3 --- um objeto que o front está "acostumado"
    return new AuthUserGetDto(user, profile, "", new Date());
  }
}
