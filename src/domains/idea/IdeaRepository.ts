import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithLabelsType";
import myPrismaClient from "../../utils/myPrismaClient";

export default class IdeaRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  async userCanAccessTab(tabId: string, requesterId: string) {
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
    });

    return !!userBelongsToGroup;
  }

  async createIdea(idea: IdeaWithRelationsType, requesterId: string) {
    const createdIdea = await this.prismaClient.idea.create({
      data: {
        ...idea,
        creatorId: requesterId,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        labels: {
          connect: idea.labels.map((label) => ({ id: label.id })),
        },
      },
      include: {
        labels: true,
      },
    });

    return createdIdea;
  }

  async findById(ideaId: string) {
    const idea = await this.prismaClient.idea.findFirst({
      where: {
        id: ideaId,
      },
    });
    return idea;
  }

  async findIdeasByTabId(tabId: string) {
    const ideas = await this.prismaClient.idea.findMany({
      where: {
        tabId: {
          equals: tabId,
        },
      },
      include: {
        labels: true,
      },
    });

    return ideas;
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
          set: idea.labels.map((label) => ({ id: label.id })),
        },
      },
      include: {
        labels: true,
      },
    });
    return updatedIdea;
  }

  async findSubideasByIdeaId(ideaId: string) {
    const subideas = await this.prismaClient.idea.findMany({
      where: {
        parentId: ideaId,
      },
    });

    return subideas;
  }

  async findIdeasAndSubIdeasByGroupId(groupId: string) {
    const ideas = await this.prismaClient.idea.findMany({
      where: {
        OR: [
          {
            tab: {
              groupId,
            },
          },
          // {
          //   parent: {
          //     tab: { groupId },
          //   },
          // },
        ],
      },
    });

    return ideas;
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
    });

    return subideas;
  }
}
