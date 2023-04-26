import myPrismaClient from "../../utils/myPrismaClient"

export class IdeaHighlightRepository {
  constructor(private prisma = myPrismaClient) {}

  findHighlightableIdeas(requesterId: string) {
    // ideas that requester id high voted, and rated as 3
    return this.prisma.idea.findMany({
      where: {
        highImpactVotes: {
          some: {
            userId: requesterId,
          },
        },
        ideaRatings: {
          some: {
            rating: 3,
            userId: requesterId,
          },
        },
        isDone: false,
      },

      include: {
        tab: {
          include: {
            group: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  findIdeaHighlights(userId: string) {
    return this.prisma.ideaHighlight.findMany({
      where: {
        userId,
      },
    })
  }

  findUserOwns(params: { userId: string; ideaId: string }) {
    return this.prisma.ideaHighlight.findFirst({
      where: {
        userId: params.userId,
        ideaId: params.ideaId,
      },
    })
  }

  create(params: { userId: string; ideaId: string }) {
    return this.prisma.ideaHighlight.create({
      data: {
        userId: params.userId,
        ideaId: params.ideaId,
      },
    })
  }

  delete(params: { userId: string; ideaId: string }) {
    return this.prisma.ideaHighlight.deleteMany({
      where: {
        userId: params.userId,
        ideaId: params.ideaId,
      },
    })
  }
}
