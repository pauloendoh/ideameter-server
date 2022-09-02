import { Group, UserGroup } from "@prisma/client";
import GroupDto from "../../types/domain/group/GroupDto";
import { SimpleUserDto } from "../../types/domain/idea/IdeaWithLabelsType";
import myPrismaClient from "../../utils/myPrismaClient";

export default class GroupRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  public async createGroup(payload: GroupDto, creatorId: string) {
    return this.prismaClient.group.create({
      data: {
        creatorId,
        ...payload,
      },
    });
  }

  public async createUserGroup(options: {
    userId: string;
    groupId: string;
    isAdmin: boolean;
  }) {
    return this.prismaClient.userGroup.create({
      data: {
        groupId: options.groupId,
        userId: options.userId,
        isAdmin: options.isAdmin,
      },
    });
  }

  public async findGroupsByUser(userId: string) {
    return this.prismaClient.group.findMany({
      where: {
        userGroups: {
          some: {
            userId: {
              equals: userId,
            },
          },
        },
      },
    });
  }

  public async isAdmin(userId: string, groupId: string) {
    const userGroup = await this.prismaClient.userGroup.findFirst({
      where: {
        userId,
        groupId,
        isAdmin: true,
      },
    });

    return !!userGroup;
  }

  public async editGroup(group: Group) {
    return this.prismaClient.group.update({
      where: {
        id: group.id,
      },
      data: group,
    });
  }

  public async deleteGroup(groupId: string) {
    return this.prismaClient.group.delete({
      where: {
        id: groupId,
      },
    });
  }

  public async userBelongsToGroup(userId: string, groupId: string) {
    const userGroup = await this.prismaClient.userGroup.findFirst({
      where: {
        userId,
        groupId,
      },
    });

    return !!userGroup;
  }

  public async findGroupMembers(
    groupId: string
  ): Promise<
    (UserGroup & {
      user: SimpleUserDto;
    })[]
  > {
    const members = await this.prismaClient.userGroup.findMany({
      where: {
        groupId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return members;
  }

  public async addMember(groupId: string, userId: string) {
    const newMember = await this.prismaClient.userGroup.create({
      data: {
        userId,
        groupId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return newMember;
  }
}
