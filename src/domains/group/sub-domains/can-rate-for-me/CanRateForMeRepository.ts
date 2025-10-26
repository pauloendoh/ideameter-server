import myPrismaClient from "../../../../utils/myPrismaClient"

export class CanRateForMeRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  async alreadyCanRate(input: {
    ownerId: string
    groupId: string
    allowedMemberId: string
  }) {
    return this.prismaClient.canRateForMe.findFirst({
      where: {
        ratingFinalOwnerId: input.ownerId,
        groupId: input.groupId,
        allowedMemberId: input.allowedMemberId,
      },
    })
  }

  async removeById(id: string) {
    return this.prismaClient.canRateForMe.delete({
      where: {
        id,
      },
    })
  }

  async createCanRate(input: {
    ownerId: string
    groupId: string
    allowedMemberId: string
  }) {
    return this.prismaClient.canRateForMe.create({
      data: {
        ratingFinalOwnerId: input.ownerId,
        groupId: input.groupId,
        allowedMemberId: input.allowedMemberId,
      },
    })
  }

  async findByFinalOwnerAndGroup(input: {
    finalOwnerId: string
    groupId: string
  }) {
    const items = await this.prismaClient.canRateForMe.findMany({
      where: {
        ratingFinalOwnerId: input.finalOwnerId,
        groupId: input.groupId,
      },
    })

    return items
  }
}
