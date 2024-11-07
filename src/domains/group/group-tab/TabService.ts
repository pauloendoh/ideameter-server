import { Group, GroupTab } from "@prisma/client"
import { ForbiddenError, NotFoundError } from "routing-controllers"
import ForbiddenError403 from "../../../utils/errors/ForbiddenError403"
import GroupRepository from "../GroupRepository"
import TabRepository from "./TabRepository"

export default class TabService {
  constructor(
    private readonly tabRepo = new TabRepository(),
    private readonly groupRepo = new GroupRepository()
  ) {}

  async createTab(groupId: string, tabName: string, requesterId: string) {
    const isAllowed = this.groupRepo.userBelongsToGroup({
      userId: requesterId,
      groupId,
    })
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to add tabs to this group"
      )

    const createdTab = await this.tabRepo.createTab(
      groupId,
      tabName,
      requesterId
    )

    return createdTab
  }

  async editTab(tab: GroupTab, requesterId: string) {
    const isAllowed = this.groupRepo.userBelongsToGroup({
      userId: requesterId,
      groupId: tab.groupId,
    })
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to edit this tab")

    const editedTab = await this.tabRepo.editTab(tab)
    return editedTab
  }

  async findGroupTabs(groupId: string, requesterId: string) {
    const isAllowed = this.groupRepo.userBelongsToGroup({
      userId: requesterId,
      groupId,
    })
    if (!isAllowed)
      throw new ForbiddenError403(
        "You're not allowed to view tabs in this group"
      )
    const groupTabs = await this.tabRepo.findGroupTabs(groupId)
    return groupTabs
    //
  }

  async deleteGroupTab(groupTab: GroupTab, requesterId: string) {
    const isAllowed = await this.groupRepo.userBelongsToGroup({
      userId: requesterId,
      groupId: groupTab.groupId,
    })
    if (!isAllowed)
      throw new ForbiddenError403("You're not allowed to delete this tab")

    const deletedTab = await this.tabRepo.deleteGroupTab(groupTab.id)
    return deletedTab
  }

  async findTabById(tabId: string, requesterId: string) {
    const tab = await this.tabRepo.findTabById(tabId)
    if (!tab) throw new NotFoundError("Tab not found.")

    const isAllowed = await this.groupRepo.userBelongsToGroup({
      userId: requesterId,
      groupId: tab.groupId,
    })
    if (!isAllowed)
      throw new ForbiddenError("You're not allowed to see this tab")

    return tab
  }

  async findGroupTabsByText(requesterId: string, text: string) {
    const groupsWithTabs = await this.groupRepo.findGroupsByUser(requesterId, {
      includeTabs: true,
    })

    const tabsAndGroup: { tab: GroupTab; group: Group }[] = []

    for (const group of groupsWithTabs) {
      for (const tab of group.tabs) {
        tabsAndGroup.push({
          group: {
            ...group,
            // @ts-expect-error
            tabs: undefined,
          },
          tab,
        })
      }
    }

    return tabsAndGroup.filter(({ tab, group }) => {
      return (
        tab.name.toLowerCase().includes(text.toLowerCase()) ||
        group.name.toLowerCase().includes(text.toLowerCase())
      )
    })
  }
}
