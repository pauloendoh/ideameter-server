import myPrismaClient from "../../utils/myPrismaClient";

export class ProfileRepository {
  constructor(private profilePrisma = myPrismaClient.profile) {}

  findProfileByUserId(userId: string) {
    return this.profilePrisma.findFirst({
      where: {
        userId,
      },
    });
  }
}
