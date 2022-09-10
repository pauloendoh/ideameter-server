import { User } from "@prisma/client";
import { CurrentUser, Get, JsonController, Param } from "routing-controllers";
import TabService from "../group/group-tab/TabService";

@JsonController("/tabs")
export class TagController {
  constructor(private tabService = new TabService()) {}

  @Get("/:tabId")
  findTagsByUserId(
    @CurrentUser({ required: true }) user: User,
    @Param("tabId") tabId: string
  ) {
    return this.tabService.findTabById(tabId, user.id);
  }
}
