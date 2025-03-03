import myPrismaClient from "../../utils/myPrismaClient"

export default class RatingRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  async userCanRateIdea(ideaId: string, requesterId: string) {
    const userGroup = await this.prismaClient.userGroup.findFirst({
      where: {
        AND: [
          {
            group: {
              tabs: {
                some: {
                  ideas: {
                    some: {
                      id: ideaId,
                      ratingsAreEnabled: true,
                    },
                  },
                },
              },
            },
          },
          {
            userId: requesterId,
          },
        ],
      },
    })

    return !!userGroup
  }

  async userCanRateSubidea(parentId: string, requesterId: string) {
    const userGroup = await this.prismaClient.userGroup.findFirst({
      where: {
        AND: [
          {
            group: {
              tabs: {
                some: {
                  ideas: {
                    some: {
                      id: parentId,
                    },
                  },
                },
              },
            },
          },
          {
            userId: requesterId,
          },
        ],
      },
    })

    return !!userGroup
  }

  async createRating(ideaId: string, rating: number | null, userId: string) {
    const saved = await this.prismaClient.ideaRating.create({
      data: {
        userId,
        rating,
        ideaId,
      },
    })
    return saved
  }

  async findAvgRatingFromIdea(ideaId: string) {
    const aggregation = await this.prismaClient.ideaRating.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        ideaId,
      },
    })

    return aggregation._avg.rating
  }

  async findRatingsByGroupId(groupId: string) {
    const ratings = await this.prismaClient.ideaRating.findMany({
      include: {
        idea: {
          select: {
            id: true,
            parentId: true,
          },
        },
      },
      where: {
        OR: [
          {
            idea: {
              tab: {
                groupId,
              },
            },
          },
          {
            idea: {
              parent: {
                tab: {
                  groupId,
                },
              },
            },
          },
        ],
      },
    })
    return ratings
  }

  async ratingExists(ideaId: string, userId: string) {
    const rating = await this.prismaClient.ideaRating.findFirst({
      where: {
        ideaId,
        userId,
      },
    })

    return rating
  }

  async updateRating(ratingId: string, rating: number | null) {
    const updated = await this.prismaClient.ideaRating.update({
      where: {
        id: ratingId,
      },
      data: {
        rating,
      },
    })
    return updated
  }

  async deleteRating(ratingId: string) {
    const deleted = await this.prismaClient.ideaRating.delete({
      where: {
        id: ratingId,
      },
    })
    return deleted
  }

  async deleteAllRatingsFromIdea(ideaId: string) {
    const deleted = await this.prismaClient.ideaRating.deleteMany({
      where: {
        ideaId,
      },
    })
    return deleted
  }

  async isOwner(params: { requesterId: string; ratingId: string }) {
    const { requesterId, ratingId } = params

    const rating = await this.prismaClient.ideaRating.findFirst({
      where: {
        id: ratingId,
        userId: requesterId,
      },
    })

    return !!rating
  }

  async refreshRating(ratingId: string) {
    return this.prismaClient.ideaRating.update({
      where: {
        id: ratingId,
      },
      data: {
        updatedAt: new Date(),
      },
    })
  }

  async findOnlyRatingsAndPositions(userId: string) {
    return this.prismaClient.ideaRating.findMany({
      where: {
        userId,
        position: {
          not: null,
        },
      },
      select: {
        id: true,
        position: true,
      },
      orderBy: {
        position: "asc",
      },
    })
  }

  async updateManyRatings(ratings: { id: string; rating: number }[]) {
    return this.prismaClient.$transaction(
      ratings.map((rating) =>
        this.prismaClient.ideaRating.update({
          where: {
            id: rating.id,
          },
          data: {
            rating: rating.rating,
          },
        })
      )
    )
  }

  async updateManyPositions(ratings: { id: string; position: number }[]) {
    return this.prismaClient.$transaction(
      ratings.map((rating) =>
        this.prismaClient.ideaRating.update({
          where: {
            id: rating.id,
          },
          data: {
            position: rating.position,
          },
        })
      )
    )
  }

  async findLastRatingsByGroupMembers(params: {
    groupId: string
    userIds: string[]
  }) {
    const { groupId, userIds } = params

    const results = await this.prismaClient.$transaction(
      userIds.map((userId) =>
        this.prismaClient.ideaRating.findMany({
          where: {
            OR: [
              {
                userId,
                idea: {
                  tab: {
                    groupId,
                  },
                },
              },
              // { // won't include subideas for now
              //   userId,
              //   idea: {
              //     parent: {
              //       tab: {
              //         groupId,
              //       },
              //     },
              //   },
              // },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 10,
          select: {
            rating: true,
            updatedAt: true,
            idea: {
              select: {
                id: true,
                name: true,
                tabId: true,
              },
            },
          },
        })
      )
    )

    return results.map((result, i) => ({
      userId: userIds[i],
      ratings: result,
    }))
  }
}
