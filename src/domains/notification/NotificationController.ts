import { User } from "@prisma/client";
import { Request } from "express";
import {
  All,
  CurrentUser,
  Get,
  JsonController,
  Req,
} from "routing-controllers";
import { NotificationService } from "./NotificationService";

@JsonController("/notifications")
export class NotificationController {
  constructor(private notificationService = new NotificationService()) {}

  @Get()
  findNotifications(
    @CurrentUser({ required: true }) user: User,
    @Req() req: Request
  ) {
    return this.notificationService.findUserNotifications(user.id);
  }

  @All("/hide-dots")
  hideNotificationDots(@CurrentUser({ required: true }) user: User) {
    return this.notificationService.hideUserNotificationsDots(user.id);
  }
}
