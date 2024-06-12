import { GroupTab, User } from "@prisma/client"
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
} from "routing-controllers"
import TabService from "../group/group-tab/TabService"

@JsonController()
export class TagController {
  constructor(private tabService = new TabService()) {}

  @Get("/tabs/:tabId")
  findTagsByUserId(
    @CurrentUser({ required: true }) user: User,
    @Param("tabId") tabId: string
  ) {
    return this.tabService.findTabById(tabId, user.id)
  }

  @Post("/group/:groupId/tab")
  createTab(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string,
    @Body() body: { name: string }
  ) {
    return this.tabService.createTab(groupId, body.name, user.id)
  }

  @Put("/group/:groupId/tab")
  updateGroupTab(
    @CurrentUser({ required: true }) user: User,
    @Body() body: GroupTab
  ) {
    return this.tabService.editTab(body, user.id)
  }

  @Delete("/group/:groupId/tab")
  deleteGroupTab(
    @CurrentUser({ required: true }) user: User,
    @Body() body: GroupTab
  ) {
    return this.tabService.deleteGroupTab(body, user.id)
  }

  @Get("/group/:groupId/tab")
  findGroupTabs(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.tabService.findGroupTabs(groupId, user.id)
  }

  @Get("/search-group-tabs")
  searchGroupTabs(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("q", { required: true }) q: string
  ) {
    return this.tabService.findGroupTabsByText(user.id, q)
  }
}
