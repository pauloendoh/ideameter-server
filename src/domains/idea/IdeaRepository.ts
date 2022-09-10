import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithLabelsType";
import myPrismaClient from "../../utils/myPrismaClient";

const selectUserFields = {
  id: true,
  username: true,
  email: true,
};

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

  async saveIdea(idea: IdeaWithRelationsType, requesterId: string) {
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
    };

    const createdIdea = await this.prismaClient.idea.upsert({
      create: {
        ...dto,
        id: undefined,
      },
      update: {
        ...dto,
      },
      include: {
        labels: true,
        assignedUsers: {
          select: selectUserFields,
        },
      },
      where: {
        id: idea.id,
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

  async findIdeasByTabId(tabId: string): Promise<IdeaWithRelationsType[]> {
    const ideas = await this.prismaClient.idea.findMany({
      where: {
        tabId: {
          equals: tabId,
        },
      },
      include: {
        labels: true,
        assignedUsers: {
          select: selectUserFields,
        },
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
          set: idea.labels?.map((label) => ({ id: label.id })),
        },
        assignedUsers: {
          set: idea.assignedUsers?.map((u) => ({ id: u.id })),
        },
      },
      include: {
        labels: true,
        assignedUsers: { select: selectUserFields },
      },
    });
    return updatedIdea;
  }

  async updateOnFire(ideaId: string, onFireSince: Date | null) {
    return this.prismaClient.idea.update({
      data: {
        onFireSince,
      },
      where: {
        id: ideaId,
      },
    });
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
        ],
      },
      include: {
        labels: true,
        assignedUsers: {
          select: selectUserFields,
        },
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

  async deleteIdea(ideaId: string) {
    return this.prismaClient.idea.deleteMany({
      where: {
        OR: [{ id: ideaId }, { parentId: ideaId }],
      },
    });
  }
}
