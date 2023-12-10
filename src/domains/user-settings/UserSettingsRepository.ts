import myPrismaClient from "../../utils/myPrismaClient"

export class UserSettingsRepository {
  constructor(private prisma = myPrismaClient) {}

  async findSettingsByUserId(userId: string) {
    return this.prisma.userSettings.findUnique({
      where: { userId },
    })
  }

  async createSettings(userId: string) {
    return this.prisma.userSettings.create({
      data: {
        userId,
      },
    })
  }

  async updateHiddenTabsIds(userId: string, hiddenTabsIds: string[]) {
    return this.prisma.userSettings.update({
      where: { userId },
      data: { hiddenTabsIds },
    })
  }
}
