import { GroupTab } from "@prisma/client";
import { ForbiddenError, NotFoundError } from "routing-controllers";
import ForbiddenError403 from "../../../utils/errors/ForbiddenError403";
import GroupRepository from "../GroupRepository";
import TabRepository from "./TabRepository";

export default class TabService {
  constructor(
    private readonly tabRepo = new TabRepository(),
    private readonly groupRepo = new GroupRepository()
  ) {}

  public async createTab(
    groupId: string,
    tabName: string,
    requesterId: string
  ) {
    const isAllowed = this.groupRepo.userBelongsToGroup(requesterId, groupId);
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to add tabs to this group"
      );

    const createdTab = await this.tabRepo.createTab(
      groupId,
      tabName,
      requesterId
    );

    return createdTab;
  }

  public async editTab(tab: GroupTab, requesterId: string) {
    const isAllowed = this.groupRepo.userBelongsToGroup(
      requesterId,
      tab.groupId
    );
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to edit this tab");

    const editedTab = await this.tabRepo.editTab(tab);
    return editedTab;
  }

  public async findGroupTabs(groupId: string, requesterId: string) {
    const isAllowed = this.groupRepo.userBelongsToGroup(requesterId, groupId);
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to view tabs in this group"
      );
    const groupTabs = await this.tabRepo.findGroupTabs(groupId);
    return groupTabs;
    //
  }

  public async deleteGroupTab(groupTab: GroupTab, requesterId: string) {
    const isAllowed = await this.groupRepo.userBelongsToGroup(
      groupTab.groupId,
      requesterId
    );
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to delete this tab");

    const deletedTab = await this.tabRepo.deleteGroupTab(groupTab.id);
    return deletedTab;
  }

  public async findTabById(tabId: string, requesterId: string) {
    const tab = await this.tabRepo.findTabById(tabId);
    if (!tab) throw new NotFoundError("Tab not found.");

    const isAllowed = await this.groupRepo.userBelongsToGroup(
      requesterId,
      tab.groupId
    );
    if (!isAllowed)
      throw new ForbiddenError("You're not allowed to see this tab");

    return tab;
  }
}
