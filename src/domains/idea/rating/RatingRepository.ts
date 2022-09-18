import myPrismaClient from "../../../utils/myPrismaClient";

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
    });

    return !!userGroup;
  }

  async createRating(ideaId: string, rating: number | null, userId: string) {
    const saved = await this.prismaClient.ideaRating.create({
      data: {
        userId,
        rating,
        ideaId,
      },
    });
    return saved;
  }

  async findAvgRatingFromIdea(ideaId: string) {
    const aggregation = await this.prismaClient.ideaRating.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        ideaId,
      },
    });

    return aggregation._avg.rating;
  }

  async findRatingsByGroupId(groupId: string) {
    const ratings = await this.prismaClient.ideaRating.findMany({
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
    });
    return ratings;
  }

  async findSubideaRatings(parentId: string) {
    const ratings = await this.prismaClient.ideaRating.findMany({
      where: {
        idea: {
          parentId,
        },
      },
    });
    return ratings;
  }

  async ratingExists(ideaId: string, userId: string) {
    const rating = await this.prismaClient.ideaRating.findFirst({
      where: {
        ideaId,
        userId,
      },
    });

    return rating;
  }

  async updateRating(ratingId: string, rating: number | null) {
    const updated = await this.prismaClient.ideaRating.update({
      where: {
        id: ratingId,
      },
      data: {
        rating,
      },
    });
    return updated;
  }

  async deleteRating(ratingId: string) {
    const deleted = await this.prismaClient.ideaRating.delete({
      where: {
        id: ratingId,
      },
    });
    return deleted;
  }
}
