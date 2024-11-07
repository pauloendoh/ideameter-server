import { Group } from "@prisma/client"
import GroupDto from "../../types/domain/group/GroupDto"
import ForbiddenError403 from "../../utils/errors/ForbiddenError403"
import UserRepository from "../user/UserRepository"
import GroupRepository from "./GroupRepository"
import { $NormalizeGroupRatings } from "./use-cases/$NormalizeGroupRatings"

export default class GroupService {
  constructor(
    private readonly repo = new GroupRepository(),
    private readonly userRepo = new UserRepository(),
    private readonly $normalizeGroupRatings = new $NormalizeGroupRatings()
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
    return this.repo.findAllGroupsAndTabs(userId)
  }

  public async editGroup(group: Group, userId: string) {
    const isAdmin = await this.repo.isAdmin(userId, group.id)
    if (!isAdmin) {
      throw new ForbiddenError403("You are not an admin of this group")
    }

    const prevGroup = await this.repo.findGroupById(group.id)

    const updatedGroup = await this.repo.editGroup(group)

    if (
      prevGroup.minRating !== updatedGroup.minRating ||
      prevGroup.maxRating !== updatedGroup.maxRating
    ) {
      await this.$normalizeGroupRatings.normalizeGroupRatings({
        groupId: group.id,
        newMinMax: { min: updatedGroup.minRating, max: updatedGroup.maxRating },
        oldMinMax: {
          min: prevGroup.minRating,
          max: prevGroup.maxRating,
        },
      })
    }

    return updatedGroup
  }

  public async deleteGroup(groupId: string, userId: string) {
    const isAdmin = await this.repo.isAdmin(userId, groupId)
    if (!isAdmin)
      throw new ForbiddenError403("You are not an admin of this group")

    const deletedGroup = await this.repo.deleteGroup(groupId)
    return deletedGroup
  }

  public async findGroupMembers(groupId: string, requesterId: string) {
    const isAllowed = await this.repo.userBelongsToGroup({
      userId: requesterId,
      groupId,
    })

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

    const membersLastOnline = await this.userRepo.findLastOnlineByIds(
      members.map((m) => m.userId)
    )

    return membersLastOnline.map((m) => ({
      userId: m.id,
      lastOnlineAt: m.lastOnlineAt,
    }))
  }
}
