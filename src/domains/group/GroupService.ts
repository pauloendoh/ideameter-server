import { Group } from "@prisma/client"
import GroupDto from "../../types/domain/group/GroupDto"
import ForbiddenError403 from "../../utils/errors/ForbiddenError403"
import myRedisClient from "../../utils/redis/myRedisClient"
import GroupRepository from "./GroupRepository"

export default class GroupService {
  constructor(
    private readonly repo = new GroupRepository(),
    private readonly redisClient = myRedisClient
  ) {}

  public async createGroup(payload: GroupDto, userId: string) {
    const createdGroup = await this.repo.createGroup(payload, userId)
    await this.repo.createUserGroup({
      userId,
      groupId: createdGroup.id,
      isAdmin: true,
    })

    return createdGroup
  }

  public async findGroupsByUser(userId: string) {
    return this.repo.findGroupsByUser(userId)
  }

  public async editGroup(group: Group, userId: string) {
    const isAdmin = await this.repo.isAdmin(userId, group.id)
    if (!isAdmin)
      throw new ForbiddenError403("You are not an admin of this group")

    return this.repo.editGroup(group)
  }

  public async deleteGroup(groupId: string, userId: string) {
    const isAdmin = await this.repo.isAdmin(userId, groupId)
    if (!isAdmin)
      throw new ForbiddenError403("You are not an admin of this group")

    const deletedGroup = await this.repo.deleteGroup(groupId)
    return deletedGroup
  }

  public async findGroupMembers(groupId: string, requesterId: string) {
    const isAllowed = await this.repo.userBelongsToGroup(requesterId, groupId)

    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to see this group content"
      )

    const members = await this.repo.findGroupMembers(groupId)

    return members
  }

  public async addMember(
    groupId: string,
    requesterId: string,
    newMemberId: string
  ) {
    const isAllowed = await this.repo.isAdmin(requesterId, groupId)
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to add members to this group"
      )

    const newMember = await this.repo.addMember(groupId, newMemberId)

    return newMember
  }

  makeGroupAdmin = async (params: {
    requesterId: string
    groupId: string
    userId: string
  }) => {
    const { requesterId, groupId, userId } = params

    const isAllowed = await this.repo.isAdmin(requesterId, groupId)
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to make changes to this group"
      )

    return this.repo.makeGroupAdmin(groupId, userId)
  }

  dismissGroupAdmin = async (params: {
    requesterId: string
    groupId: string
    userId: string
  }) => {
    const { requesterId, groupId, userId } = params

    const isAllowed = await this.repo.isAdmin(requesterId, groupId)
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to make changes to this group"
      )

    return this.repo.dismissGroupAdmin(groupId, userId)
  }

  removeUserFromGroup = async (params: {
    requesterId: string
    groupId: string
    userId: string
  }) => {
    const { requesterId, groupId, userId } = params

    const isAllowed = await this.repo.isAdmin(requesterId, groupId)
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to make changes to this group"
      )

    return this.repo.removeUserFromGroup(userId, groupId)
  }

  async findGroupMembersLastOnline(userId: string, groupId: string) {
    const members = await this.findGroupMembers(groupId, userId)

    // const membersLastOnline = await Promise.all(
    //   members.map(async (member) => {
    //     const lastOnlineAt = await this.redisClient.get(
    //       redisKeys.userLastOnline(member.userId)
    //     )

    //     return { userId: member.userId, lastOnlineAt }
    //   })
    // )

    return []
  }
}
