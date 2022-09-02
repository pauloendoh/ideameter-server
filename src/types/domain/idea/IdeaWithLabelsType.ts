import { Idea, Label } from "@prisma/client";

export type IdeaWithRelationsType = Idea & {
  labels: Label[];
  assignedUsers: SimpleUserDto[];
};

export type SimpleUserDto = {
  id: string;
  username: string;
  email: string;
};
