import { User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Put,
} from "routing-controllers"
import { UserSettingsService } from "./UserSettingsService"

@JsonController()
export class UserSettingsController {
  constructor(private service = new UserSettingsService()) {}

  @Get("/me/settings")
  findOrCreateSettings(@CurrentUser({ required: true }) user: User) {
    return this.service.findOrCreateSettings(user.id)
  }

  @Put("/me/settings/hidden-tabs-ids")
  updateHiddenTabsIds(
    @CurrentUser({ required: true }) user: User,
    @Body() body: { hiddenTabsIds: string[] }
  ) {
    return this.service.updateHiddenTabsIds(user.id, body.hiddenTabsIds)
  }
}
