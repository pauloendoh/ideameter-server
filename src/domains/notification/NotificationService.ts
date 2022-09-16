import { Server } from "socket.io";
import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithLabelsType";
import IdeaRepository from "../idea/IdeaRepository";
import { NotificationRepository } from "./NotificationRepository";

export class NotificationService {
  constructor(
    private notificationRepo = new NotificationRepository(),
    private ideaRepository = new IdeaRepository()
  ) {}

  findUserNotifications(userId: string) {
    return this.notificationRepo.findUserNotifications(userId);
  }

  async handleMentionNotificationsCreateIdea(
    idea: IdeaWithRelationsType,
    requesterId: string,
    socketServer: Server
  ) {
    const usernamesMentioned = this.getUsernamesMentionedInDescription(idea);

    const groupUsersMentioned = await this.ideaRepository.usernamesCanAccessIdea(
      usernamesMentioned,
      idea.id
    );

    const otherUsersMentioned = groupUsersMentioned.filter(
      (u) => u.id !== requesterId
    );
    if (otherUsersMentioned.length > 0) {
      const notifications = await this.notificationRepo.createIdeaMentionNotification(
        {
          idea,
          requesterId,
          users: otherUsersMentioned,
        }
      );

      for (const notification of notifications) {
        socketServer.sockets.emit(
          `updateUserNotifications-${notification.userId}`,
          notification
        );
      }
    }
  }

  async handleMentionNotificationsUpdateIdea(
    previousIdea: IdeaWithRelationsType,
    updatedIdea: IdeaWithRelationsType,
    requesterId: string,
    socketServer: Server
  ) {
    const previousUsernames = this.getUsernamesMentionedInDescription(
      previousIdea
    );
    const afterUsernames = this.getUsernamesMentionedInDescription(updatedIdea);

    const newUsernames = afterUsernames.filter(
      (u) => !previousUsernames.includes(u)
    );

    const groupUsersMentioned = await this.ideaRepository.usernamesCanAccessIdea(
      newUsernames,
      updatedIdea.id
    );

    const otherUsersMentioned = groupUsersMentioned.filter(
      (u) => u.id !== requesterId
    );
    if (otherUsersMentioned.length > 0) {
      const notifications = await this.notificationRepo.createIdeaMentionNotification(
        {
          idea: updatedIdea,
          requesterId,
          users: otherUsersMentioned,
        }
      );

      for (const notification of notifications) {
        socketServer.sockets.emit(
          `updateUserNotifications-${notification.userId}`,
          notification
        );
      }
    }
  }

  getUsernamesMentionedInDescription(idea: IdeaWithRelationsType): string[] {
    const newIdea = idea;

    // ex: @</span>test</span>﻿</span>... -> test</span>...
    const splits = newIdea.description
      .split("@</span>")
      .filter((s) => s.includes("</span>"));

    // test</span>... -> test
    const usernames = splits.map((s) => s.split("</span>")[0]);

    return usernames;
  }

  async hideUserNotificationsDots(userId: string) {
    await this.notificationRepo.hideUserNotificationsDots(userId);

    return this.findUserNotifications(userId);
  }
}
