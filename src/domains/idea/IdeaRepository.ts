import { Idea } from "@prisma/client";
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

  async createIdea(idea: Idea, requesterId: string) {
    const createdIdea = await this.prismaClient.idea.create({
      data: { ...idea, creatorId: requesterId, id: undefined },
    });

    return createdIdea;
  }
}
