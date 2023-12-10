import { UserSettingsRepository } from "./UserSettingsRepository"

export class UserSettingsService {
  constructor(private repo = new UserSettingsRepository()) {}

  async findOrCreateSettings(requesterId: string) {
    const settings = await this.repo.findSettingsByUserId(requesterId)

    if (settings) {
      return settings
    }

    return this.repo.createSettings(requesterId)
  }

  async updateHiddenTabsIds(requesterId: string, hiddenTabsIds: string[]) {
    return this.repo.updateHiddenTabsIds(requesterId, hiddenTabsIds)
  }
}
