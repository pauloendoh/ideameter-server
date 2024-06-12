import { Group, UserGroup } from "@prisma/client"
import GroupDto from "../../types/domain/group/GroupDto"
import { SimpleUserDto } from "../../types/domain/idea/IdeaWithRelationsType"
import ForbiddenError403 from "../../utils/errors/ForbiddenError403"
import myPrismaClient from "../../utils/myPrismaClient"

export default class GroupRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  public async createGroup(payload: GroupDto, creatorId: string) {
    return this.prismaClient.group.create({
      data: {
        creatorId,
        ...payload,
        id: undefined,
      },
    })
  }

  public async createUserGroup(options: {
    userId: string
    groupId: string
    isAdmin: boolean
  }) {
    return this.prismaClient.userGroup.create({
      data: {
        groupId: options.groupId,
        userId: options.userId,
        isAdmin: options.isAdmin,
      },
    })
  }

  public async findGroupsByUser(
    userId: string,
    options?: {
      includeTabs?: boolean
    }
  ) {
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
      include: {
        tabs: options?.includeTabs,
      },
    })
  }

  public async isAdmin(userId: string, groupId: string) {
    const userGroup = await this.prismaClient.userGroup.findFirst({
      where: {
        userId,
        groupId,
        isAdmin: true,
      },
    })

    return !!userGroup
  }

  async makeGroupAdmin(groupId: string, userId: string) {
    return this.prismaClient.userGroup.update({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      data: {
        isAdmin: true,
      },
    })
  }

  async dismissGroupAdmin(groupId: string, userId: string) {
    return this.prismaClient.userGroup.update({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      data: {
        isAdmin: false,
      },
    })
  }

  async removeUserFromGroup(userId: string, groupId: string) {
    return this.prismaClient.userGroup.delete({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    })
  }

  public async editGroup(group: Group) {
    return this.prismaClient.group.update({
      where: {
        id: group.id,
      },
      data: group,
    })
  }

  public async deleteGroup(groupId: string) {
    return this.prismaClient.group.delete({
      where: {
        id: groupId,
      },
    })
  }

  public async userBelongsToGroup(userId: string, groupId: string) {
    const userGroup = await this.prismaClient.userGroup.findFirst({
      where: {
        userId,
        groupId,
      },
    })

    return !!userGroup
  }

  public async userIsAllowedOrThrow(userId: string, groupId: string) {
    const userGroup = await this.prismaClient.userGroup.findFirst({
      where: {
        userId,
        groupId,
      },
    })

    if (!userGroup) {
      throw new ForbiddenError403("User is not allowed to perform this action")
    }
    return true
  }

  public async findGroupMembers(groupId: string): Promise<
    (UserGroup & {
      user: SimpleUserDto
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
            profile: true,
            lastOnlineAt: true,
          },
        },
      },
    })

    return members
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
    })

    return newMember
  }

  findGroupsByIdeaIds(ideaIds: string[]) {
    return this.prismaClient.group.findMany({
      distinct: "id",

      where: {
        tabs: {
          some: {
            ideas: {
              some: {
                id: {
                  in: ideaIds,
                },
              },
            },
          },
        },
      },
    })
  }

  findGroupByIdeaId(ideaId: string) {
    return this.prismaClient.group.findFirst({
      where: {
        OR: [
          {
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
          {
            tabs: {
              some: {
                ideas: {
                  some: {
                    subIdeas: {
                      some: {
                        id: ideaId,
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    })
  }

  findGroupByTabId(tabId: string) {
    return this.prismaClient.group.findFirst({
      where: {
        tabs: {
          some: {
            id: tabId,
          },
        },
      },
    })
  }

  findAllGroupsAndTabs(userId: string) {
    return this.prismaClient.group.findMany({
      where: {
        userGroups: {
          some: {
            userId,
          },
        },
      },
      include: {
        tabs: true,
      },
    })
  }
}
