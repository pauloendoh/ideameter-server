import { Group } from "@prisma/client";
import GroupDto from "../../types/domain/group/GroupDto";
import UnauthorizedError401 from "../../utils/errors/UnauthorizedError401";
import GroupRepository from "./GroupRepository";

export default class GroupService {
  constructor(private readonly repo = new GroupRepository()) {}

  public async createGroup(payload: GroupDto, userId: string) {
    const createdGroup = await this.repo.createGroup(payload, userId);
    await this.repo.createUserGroup({
      userId,
      groupId: createdGroup.id,
      isAdmin: true,
    });

    return createdGroup;
  }

  public async findGroupsByUser(userId: string) {
    return this.repo.findGroupsByUser(userId);
  }

  public async editGroup(group: Group, userId: string) {
    const isAdmin = await this.repo.isAdmin(userId, group.id);
    if (!isAdmin)
      throw new UnauthorizedError401("You are not an admin of this group");

    return this.repo.editGroup(group);
  }

  public async deleteGroup(groupId: string, userId: string) {
    const isAdmin = await this.repo.isAdmin(userId, groupId);
    if (!isAdmin)
      throw new UnauthorizedError401("You are not an admin of this group");

    const deletedGroup = await this.repo.deleteGroup(groupId);
    return deletedGroup;
  }

  public async findGroupMembers(groupId: string, requesterId: string) {
    const isAllowed = await this.repo.userBelongsToGroup(requesterId, groupId);

    if (!isAllowed)
      throw new UnauthorizedError401(
        "You're not allowed to see this group content"
      );

    const members = await this.repo.findGroupMembers(groupId);

    return members;
  }

  public async addMember(
    groupId: string,
    requesterId: string,
    newMemberId: string
  ) {
    const isAllowed = await this.repo.isAdmin(requesterId, groupId);
    if (!isAllowed)
      throw new UnauthorizedError401(
        "You're not allowed to add members to this group"
      );

    const newMember = await this.repo.addMember(groupId, newMemberId);

    return newMember;
  }
}
