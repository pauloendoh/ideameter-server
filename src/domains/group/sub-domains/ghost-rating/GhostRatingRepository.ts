import { Prisma } from "@prisma/client"
import myPrismaClient from "../../../../utils/myPrismaClient"
import {
  $GhostRating,
  $GhostRatingWithRelations,
} from "../../../_domain-models/$GhostRating"

export class GhostRatingRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  private _unchangeableFields = {
    id: undefined,
    userId: undefined,
    ideaId: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  } satisfies Partial<$GhostRating>

  async findAlreadyGhostRated(input: {
    ideaId: string
    ownerId: string
    targetUserId: string
  }): Promise<$GhostRatingWithRelations | null> {
    return this.prismaClient.ghostRating.findFirst({
      where: {
        ideaId: input.ideaId,
        userId: input.ownerId,
        targetUserId: input.targetUserId,
      },
      include: {
        idea: true,
      },
    })
  }

  async deleteGhostRating(id: string) {
    return this.prismaClient.ghostRating.delete({
      where: {
        id,
      },
    })
  }

  async updateGhostRating(
    id: string,
    updateData: Prisma.GhostRatingUpdateArgs["data"]
  ) {
    return this.prismaClient.ghostRating.update({
      where: {
        id,
      },
      data: updateData,
    })
  }

  async createGhostRating(minFields: Prisma.GhostRatingCreateArgs["data"]) {
    return this.prismaClient.ghostRating.create({
      data: {
        ...minFields,
      },
    })
  }

  async findGhostRatingsByUserAndGroup(input: {
    userId: string
    groupId: string
  }): Promise<$GhostRating[]> {
    const items = await this.prismaClient.ghostRating.findMany({
      where: {
        userId: input.userId,
        idea: {
          OR: [
            {
              tab: {
                groupId: input.groupId,
              },
            },
            {
              parent: {
                tab: {
                  groupId: input.groupId,
                },
              },
            },
          ],
        },
      },
    })

    return items
  }
}
