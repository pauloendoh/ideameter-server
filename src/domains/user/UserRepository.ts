import { PrismaClient } from "@prisma/client";

export default class UserRepository {
  constructor(private readonly prismaClient = new PrismaClient()) {}

  public async findById(userId: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    });

    return user;
  }
}
