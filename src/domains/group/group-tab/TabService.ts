import UnauthorizedError401 from "../../../utils/errors/UnauthorizedError401";
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
      throw new UnauthorizedError401(
        "You're not allowed to add tabs to this group"
      );

    const createdTab = await this.tabRepo.createTab(
      groupId,
      tabName,
      requesterId
    );

    return createdTab;
  }

  public async findGroupTabs(groupId: string, requesterId: string) {
    const isAllowed = this.groupRepo.userBelongsToGroup(requesterId, groupId);
    if (!isAllowed)
      throw new UnauthorizedError401(
        "You're not allowed to view tabs in this group"
      );
    const groupTabs = await this.tabRepo.findGroupTabs(groupId);
    return groupTabs;
  }
}
