import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithRelationsType"
import myPrismaClient from "../../utils/myPrismaClient"
import { ideaIncludeFields } from "../../utils/prisma/fields/idea/ideaIncludeFields"
import { waitingIdeasSelectFields } from "../../utils/prisma/fields/waitingIdeasSelectFields"

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

  async userCanAccessTabs(input: { tabIds: string[]; requesterId: string }) {
    const { tabIds, requesterId } = input
    const userBelongsToGroup = await this.prismaClient.$transaction(
      tabIds.map((tabId) =>
        this.prismaClient.userGroup.findFirst({
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
      )
    )

    return (
      userBelongsToGroup.filter((userGroup) => userGroup !== null).length ===
      tabIds.length
    )
  }

  async upsertIdea(
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
            userId_ideaId: {
              userId: vote.userId,
              ideaId: idea.id,
            },
          },
          create: {
            userId: vote.userId,
          },
        })),
      },
      waitingIdeas: undefined,
      beingWaitedFor: undefined,
    }

    const createdIdea = await this.prismaClient.idea.upsert({
      create: {
        ...dto,
        id: undefined,
        parentId: dto.parentId || undefined,
      } as any, // PE 1/3 - fix this as any (difficult; maybe make simpler repositories methods? Separate relationship creation update etc;)
      update: {
        // do we ever update here?
        ...dto,
      } as any,

      include: ideaIncludeFields,
      where: {
        id: idea.id,
      },
    })

    return createdIdea as IdeaWithRelationsType
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
    const previous = await this.prismaClient.idea.findFirst({
      where: {
        id: idea.id,
      },
      include: ideaIncludeFields,
    })

    if (!previous) {
      throw new Error("Idea not found")
    }

    const updatedIdea = await this.prismaClient.idea.update({
      where: {
        id: idea.id,
      },
      data: {
        ...idea,
        createdAt: undefined,
        updatedAt: undefined,
        labels: {
          set: idea.labels?.map((label) => ({ id: label.id })),
        },
        assignedUsers: {
          set: idea.assignedUsers?.map((u) => ({ id: u.id })),
        },
        highImpactVotes: {
          connectOrCreate: idea.highImpactVotes?.map((vote) => ({
            where: {
              userId_ideaId: {
                userId: vote.userId,
                ideaId: vote.ideaId,
              },
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
        waitingIdeas: undefined,
        beingWaitedFor: undefined,
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
      include: {
        ...ideaIncludeFields,
      },
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

  async isSubidea(ideaIds: string[]) {
    const found = await this.prismaClient.idea.findMany({
      where: {
        id: {
          in: ideaIds,
        },
        parentId: null,
      },
    })

    return found.length === 0
  }

  async deleteIdea(ideaId: string) {
    return this.prismaClient.idea.deleteMany({
      where: {
        OR: [{ id: ideaId }, { parentId: ideaId }],
      },
    })
  }

  async userIdsCanAccessIdea(params: { userIds: string[]; ideaId: string }) {
    const { userIds, ideaId } = params
    return this.prismaClient.user.findMany({
      where: {
        id: {
          in: userIds,
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
        highImpactVotes: true,
      },
      where: {
        assignedUsers: {
          some: {
            id: userId,
          },
        },
        isArchived: false,
      },
    })
  }

  async findHighImpactVotedByMe(userId: string) {
    return await this.prismaClient.idea.findMany({
      include: {
        tab: {
          include: {
            group: true,
          },
        },
        highImpactVotes: true,
        assignedUsers: true,
        ideaRatings: {
          where: {
            userId,
          },
        },
      },
      where: {
        isArchived: false,
        highImpactVotes: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async ratedIdeasByUser(userId: string) {
    return await this.prismaClient.idea.findMany({
      include: {
        tab: {
          include: {
            group: true,
          },
        },
        highImpactVotes: true,
        ideaRatings: {
          where: {
            userId,
          },
        },
        assignedUsers: true,
        waitingIdeas: {
          select: waitingIdeasSelectFields,
        },
        beingWaitedFor: {
          select: waitingIdeasSelectFields,
        },
        labels: {
          select: {
            id: true,
            name: true,
            bgColor: true,
          },
        },
      },
      where: {
        isArchived: false,
        ideaRatings: {
          some: {
            AND: [
              {
                userId,
                idea: {
                  tabId: {
                    not: null,
                  },
                },
              },
            ],
          },
        },
      },
      orderBy: {
        updatedAt: "asc",
      },
    })
  }

  async findArchivedIdeasByGroupId(groupId: string) {
    const ideas = await this.prismaClient.idea.findMany({
      where: {
        tab: {
          groupId,
        },
        isArchived: true,
      },
      include: ideaIncludeFields,
    })

    return ideas
  }

  async findIdeasByIds(ideaIds: string[]) {
    return this.prismaClient.idea.findMany({
      where: {
        id: {
          in: ideaIds,
        },
      },
      include: ideaIncludeFields,
    })
  }

  async createMany(
    dtos: {
      name: string
      description: string
    }[],
    tabId: string,
    requesterId: string
  ) {
    const ideas = await this.prismaClient.idea.createMany({
      data: dtos.map((dto) => ({
        name: dto.name,
        description: dto.description,
        tabId,
        creatorId: requesterId,
      })),
    })

    return ideas
  }

  async deleteManyIdeas(ideaIds: string[]) {
    return this.prismaClient.idea.deleteMany({
      where: {
        id: {
          in: ideaIds,
        },
      },
    })
  }

  async addLabelsToIdeas(params: { labelIds: string[]; ideaIds: string[] }) {
    const { labelIds, ideaIds } = params
    return this.prismaClient.$transaction(
      ideaIds.map((ideaId) =>
        this.prismaClient.idea.update({
          where: {
            id: ideaId,
          },
          data: {
            labels: {
              connect: labelIds.map((labelId) => ({ id: labelId })),
            },
          },
        })
      )
    )
  }
}
