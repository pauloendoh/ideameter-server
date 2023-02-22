import { User } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"
import { userSelectFields } from "../../utils/prisma/fields/user/userSelectFields"

export default class UserRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  public async findById(userId: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    })

    return user
  }

  findUsersByIds(userIds: string[]) {
    return this.prismaClient.user.findMany({
      select: userSelectFields,

      where: {
        id: { in: userIds },
      },
    })
  }

  public async findByText(text: string) {
    return this.prismaClient.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: text,
            },
          },
          {
            username: { contains: text },
          },
        ],

        // OR: [
        //   {
        //     email: {
        //       contains: text,
        //     },
        //     username: {
        //       contains: text,
        //     },
        //   },
        // ],
      },
      select: userSelectFields,
    })
  }

  public async updateLastOpenedGroupId(userId: string, groupId: string) {
    return this.prismaClient.user.update({
      data: {
        lastOpenedGroupId: groupId,
      },
      where: {
        id: userId,
      },
    })
  }

  async findByEmail(email: string) {
    return this.prismaClient.user.findFirst({
      where: { email },
    })
  }

  async updateUser(user: User) {
    return this.prismaClient.user.update({
      data: user,
      where: {
        id: user.id,
      },
    })
  }

  async updateLastOnlineAt(userId: string) {
    return this.prismaClient.user.update({
      data: {
        lastOnlineAt: new Date(),
      },
      where: {
        id: userId,
      },
    })
  }

  async findLastOnlineByIds(userIds: string[]) {
    return this.prismaClient.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        lastOnlineAt: true,
      },
    })
  }
}
