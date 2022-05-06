import { IdeaWithLabelsType } from "../../types/domain/idea/IdeaWithLabelsType";
import myPrismaClient from "../../utils/myPrismaClient";

export default class IdeaRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  async isAllowed(tabId: string, requesterId: string) {
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

  async createIdea(idea: IdeaWithLabelsType, requesterId: string) {
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

  async updateIdea(idea: IdeaWithLabelsType): Promise<IdeaWithLabelsType> {
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
}
