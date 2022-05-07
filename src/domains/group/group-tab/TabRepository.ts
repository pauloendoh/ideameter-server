import { GroupTab } from "@prisma/client";
import myPrismaClient from "../../../utils/myPrismaClient";

export default class TabRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  public async createTab(groupId: string, tabName: string, creatorId: string) {
    return this.prismaClient.groupTab.create({
      data: {
        name: tabName,
        creatorId,
        groupId,
      },
    });
  }

  public async editTab(tab: GroupTab) {
    return this.prismaClient.groupTab.update({
      data: {
        ...tab,
        updatedAt: undefined,
      },
      where: {
        id: tab.id,
      },
    });
  }

  public async findGroupTabs(groupId: string) {
    return this.prismaClient.groupTab.findMany({
      where: {
        groupId,
      },
    });
  }

  public async deleteGroupTab(tabId: string) {
    const deleted = this.prismaClient.groupTab.delete({
      where: {
        id: tabId,
      },
    });
    return deleted;
  }
}
