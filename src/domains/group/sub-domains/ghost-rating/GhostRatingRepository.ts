import { GhostRating, Prisma } from "@prisma/client"
import myPrismaClient from "../../../../utils/myPrismaClient"
import { $GhostRating } from "../../../_domain-models/$GhostRating"

export class GhostRatingRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  private _unchangeableFields = {
    id: undefined,
    userId: undefined,
    ideaId: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  } satisfies Partial<GhostRating>

  async findGhostRatingByIdeaAndUser(input: {
    ideaId: string
    userId: string
  }): Promise<GhostRating | null> {
    return this.prismaClient.ghostRating.findFirst({
      where: {
        ideaId: input.ideaId,
        userId: input.userId,
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

  async updateGhostRating(input: GhostRating) {
    return this.prismaClient.ghostRating.update({
      where: {
        id: input.id,
      },
      data: {
        ...input,
        ...this._unchangeableFields,
      },
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
          tab: {
            groupId: input.groupId,
          },
        },
      },
    })

    return items
  }
}
