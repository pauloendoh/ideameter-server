import { User } from "@prisma/client";
import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithRelationsType";
import { NotificationDto } from "../../types/domain/notification/NotificationDto";
import myPrismaClient from "../../utils/myPrismaClient";
import GroupRepository from "../group/GroupRepository";
import IdeaRepository from "../idea/IdeaRepository";
import UserRepository from "../user/UserRepository";

export class NotificationRepository {
  constructor(
    private prismaClient = myPrismaClient,
    private userRepository = new UserRepository(),
    private ideaRepository = new IdeaRepository(),
    private groupRepository = new GroupRepository()
  ) {}

  async findUserNotifications(userId: string): Promise<NotificationDto[]> {
    const notifications = await this.prismaClient.notification.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    // PE 2/3 - I thought relations with JSON fields would be easier...
    // I didn't find a way to do this in a single query in Prisma...
    // I guess this is the advantage of MongoDb map reduce!!! :D
    const userIds: string[] = notifications.reduce((curr, n) => {
      if (!curr.includes(n.ideaDescriptionMention?.["mentionById"]))
        return [...curr, n.ideaDescriptionMention?.["mentionById"]];
      return curr;
    }, []);

    const users = await this.userRepository.findUsersByIds(userIds);

    const ideaIds: string[] = notifications.reduce((curr, n) => {
      if (!curr.includes(n.ideaDescriptionMention?.["ideaId"]))
        return [...curr, n.ideaDescriptionMention?.["ideaId"]];
      return curr;
    }, []);

    const ideasAndGroups = await this.ideaRepository.findIdeasAndGroupsByIds(
      ideaIds
    );

    const groupIdeas = await this.groupRepository.findGroupsByIdeaIds(ideaIds);

    return notifications.map((notification) => {
      const ideaGroup = ideasAndGroups.find(
        (ig) => ig.id === notification.ideaDescriptionMention["ideaId"]
      );
      const mentionBy = users.find(
        (u) => u.id === notification.ideaDescriptionMention["mentionById"]
      );

      return {
        ...notification,
        ideaDescriptionMention: notification.ideaDescriptionMention
          ? {
              idea: ideaGroup,
              mentionBy,
            }
          : null,
      };
    });
  }

  async createIdeaMentionNotification({
    idea,
    requesterId,
    users,
  }: {
    idea: IdeaWithRelationsType;
    requesterId: string;
    users: User[];
  }) {
    return this.prismaClient.$transaction(
      users.map((user) =>
        this.prismaClient.notification.create({
          data: {
            userId: user.id,
            ideaDescriptionMention: {
              mentionById: requesterId,
              ideaId: idea.id,
            },
          },
        })
      )
    );
  }

  async hideUserNotificationsDots(userId: string) {
    return this.prismaClient.notification.updateMany({
      data: {
        showDot: false,
      },
      where: {
        userId,
      },
    });
  }
}
