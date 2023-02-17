import { Group, User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  UploadedFile,
} from "routing-controllers"
import GroupDto from "../../types/domain/group/GroupDto"
import { profileImageMulterConfig } from "../../utils/multer/profileImageMulterConfig"
import { urls } from "../../utils/urls"
import { AwsFileDto } from "../profile/types/AwsFileDto"
import { MulterFileDto } from "../profile/types/MulterFileDto"
import GroupService from "./GroupService"
import { GroupUserIdDto } from "./types/GroupUserIdDto"

@JsonController("/group")
export class GroupController {
  constructor(private groupService = new GroupService()) {}

  @Post()
  createGroup(
    @CurrentUser({ required: true }) user: User,
    @Body() body: GroupDto
  ) {
    return this.groupService.createGroup(body, user.id)
  }

  @Get()
  findUserGroups(@CurrentUser({ required: true }) user: User) {
    return this.groupService.findGroupsByUser(user.id)
  }

  @Put()
  updateGroup(
    @CurrentUser({ required: true }) user: User,
    @Body() body: Group
  ) {
    return this.groupService.editGroup(body, user.id)
  }

  // this must come before /:groupId, otherwise, it will get "overwritten"
  @Delete("/admin")
  dismissGroupAdmin(
    @CurrentUser({ required: true }) user: User,
    @Body() body: GroupUserIdDto
  ) {
    return this.groupService.dismissGroupAdmin({
      groupId: body.groupId,
      requesterId: user.id,
      userId: body.userId,
    })
  }

  @Delete("/:groupId")
  deleteGroup(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.groupService.deleteGroup(groupId, user.id)
  }

  @Get("/:groupId/members")
  findGroupMembers(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.groupService.findGroupMembers(groupId, user.id)
  }

  @Post("/:groupId/members/:memberId")
  addGroupMember(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string,
    @Param("memberId") memberId: string
  ) {
    return this.groupService.addMember(groupId, user.id, memberId)
  }

  @Post("/admin")
  makeGroupAdmin(
    @CurrentUser({ required: true }) user: User,
    @Body() body: GroupUserIdDto
  ) {
    return this.groupService.makeGroupAdmin({
      groupId: body.groupId,
      requesterId: user.id,
      userId: body.userId,
    })
  }

  @Delete("/:groupId/users/:userId")
  removeUserFromGroup(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string,
    @Param("userId") userId: string
  ) {
    return this.groupService.removeUserFromGroup({
      groupId: groupId,
      requesterId: user.id,
      userId: userId,
    })
  }

  @Put("/image")
  uploadGroupImage(
    @CurrentUser({ required: true }) user: User,
    @UploadedFile("file", { options: profileImageMulterConfig })
    file: AwsFileDto | MulterFileDto
  ) {
    if ("Location" in file) return file.Location
    return urls.publicUploads(file.filename)
  }

  @Get("/:groupId/members-last-online")
  findGroupMembersLastOnline(
    @Param("groupId") groupId: string,
    @QueryParam("asUserId") asUserId: string
  ) {
    return this.groupService.findGroupMembersLastOnline(asUserId, groupId)
  }
}
