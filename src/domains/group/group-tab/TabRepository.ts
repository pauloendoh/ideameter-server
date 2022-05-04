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

  public async findGroupTabs(groupId: string) {
    return this.prismaClient.groupTab.findMany({
      where: {
        groupId,
      },
    });
  }
}
