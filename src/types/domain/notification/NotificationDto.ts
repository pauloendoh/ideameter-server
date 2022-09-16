import { Idea } from "@prisma/client";
import { SimpleUserDto } from "../user/SimpleUserDto";

export interface NotificationDto {
  ideaDescriptionMention: null | {
    idea: Idea;
    mentionBy: SimpleUserDto;
  };
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  showDot: boolean;
}
