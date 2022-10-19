import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithRelationsType"
import myPrismaClient from "../../utils/myPrismaClient"
import { ideaIncludeFields } from "../../utils/prisma/fields/idea/ideaIncludeFields"

export default class IdeaRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  async userCanAccessTab(tabId: string, requesterId: string) {
    if (tabId === null) {
      console.log("we gotta fix this. Parent idea should always have a tabId") // happening on RatingService.findSubideaRatings
      return false
    }
    const userBelongsToGroup = await this.prismaClient.userGroup.findFirst({
      where: {
        userId: requesterId,
        group: {
          tabs: {
            some: {
              id: tabId,
            },
          },
        },
      },
    })

    return !!userBelongsToGroup
  }

  async saveIdea(
    idea: IdeaWithRelationsType,
    requesterId: string
  ): Promise<IdeaWithRelationsType> {
    const dto = {
      ...idea,

      creatorId: requesterId,
      createdAt: undefined,
      updatedAt: undefined,
      labels: {
        connect: idea.labels?.map((l) => ({ id: l.id })),
      },
      assignedUsers: {
        connect: idea.assignedUsers?.map((u) => ({ id: u.id })),
      },
      highImpactVotes: {
        connectOrCreate: idea.highImpactVotes?.map((vote) => ({
          where: {
            userId_ideaId: vote,
          },
          create: {
            userId: vote.userId,
          },
        })),
      },
    }

    const createdIdea = await this.prismaClient.idea.upsert({
      create: {
        ...dto,
        id: undefined,
        parentId: dto.parentId || undefined,
      },
      update: {
        ...dto,
      },

      include: ideaIncludeFields,
      where: {
        id: idea.id,
      },
    })

    return createdIdea
  }

  async findById(ideaId: string) {
    const idea = await this.prismaClient.idea.findFirst({
      where: {
        id: ideaId,
      },
      include: ideaIncludeFields,
    })
    return idea
  }

  async findIdeasAndGroupsByIds(ideaIds: string[]) {
    return this.prismaClient.idea.findMany({
      where: {
        id: { in: ideaIds },
      },
      include: {
        tab: {
          select: {
            group: true,
          },
        },
      },
    })
  }

  async updateIdea(
    idea: IdeaWithRelationsType
  ): Promise<IdeaWithRelationsType> {
    const updatedIdea = await this.prismaClient.idea.update({
      where: {
        id: idea.id,
      },
      data: {
        ...idea,
        labels: {
          set: idea.labels?.map((label) => ({ id: label.id })),
        },
        assignedUsers: {
          set: idea.assignedUsers?.map((u) => ({ id: u.id })),
        },
        highImpactVotes: {
          connectOrCreate: idea.highImpactVotes?.map((vote) => ({
            where: {
              userId_ideaId: vote,
            },
            create: {
              userId: vote.userId,
            },
          })),
          deleteMany: {
            AND: [
              { ideaId: idea.id },
              {
                userId: {
                  notIn: idea.highImpactVotes?.map((vote) => vote.userId),
                },
              },
            ],
          },
        },
      },
      include: ideaIncludeFields,
    })
    return updatedIdea
  }

  async updateOnFire(ideaId: string, onFireSince: Date | null) {
    return this.prismaClient.idea.update({
      data: {
        onFireSince,
        irrelevantSince: null,
      },
      where: {
        id: ideaId,
      },
    })
  }

  async updateIrrelevantIdea(ideaId: string, irrelevantSince: Date | null) {
    return this.prismaClient.idea.update({
      data: {
        irrelevantSince,
        onFireSince: null,
      },
      where: {
        id: ideaId,
      },
    })
  }

  async findSubideasByIdeaId(ideaId: string) {
    const subideas = await this.prismaClient.idea.findMany({
      where: {
        parentId: ideaId,
      },
      include: ideaIncludeFields,
    })

    return subideas
  }

  async findIdeasByGroupId(groupId: string) {
    const ideas = await this.prismaClient.idea.findMany({
      where: {
        tab: {
          groupId,
        },
      },
      include: ideaIncludeFields,
    })

    return ideas
  }

  async findSubideasByGroupId(groupId: string) {
    const subideas = await this.prismaClient.idea.findMany({
      where: {
        parent: {
          tab: {
            groupId,
          },
        },
      },
      include: ideaIncludeFields,
    })

    return subideas
  }

  async deleteIdea(ideaId: string) {
    return this.prismaClient.idea.deleteMany({
      where: {
        OR: [{ id: ideaId }, { parentId: ideaId }],
      },
    })
  }

  async usernamesCanAccessIdea(usernames: string[], ideaId: string) {
    return this.prismaClient.user.findMany({
      where: {
        username: {
          in: usernames,
        },
        userGroups: {
          some: {
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
        },
      },
    })
  }

  async findTabsByIdeaIds(ideaIds: string[]) {
    return this.prismaClient.groupTab.findMany({
      where: {
        ideas: {
          some: {
            id: {
              in: ideaIds,
            },
          },
        },
      },
      distinct: "id",
    })
  }

  async moveIdeasToTabId(ideaIds: string[], tabId: string) {
    return this.prismaClient.$transaction(
      ideaIds.map((ideaId) =>
        this.prismaClient.idea.update({
          where: { id: ideaId },
          data: { tabId },
          include: ideaIncludeFields,
        })
      )
    )
  }

  async findAssignedIdeasToUser(userId: string) {
    return await this.prismaClient.idea.findMany({
      include: {
        tab: {
          include: {
            group: true,
          },
        },
      },
      where: {
        assignedUsers: {
          some: {
            id: userId,
          },
        },
      },
    })
  }
}
