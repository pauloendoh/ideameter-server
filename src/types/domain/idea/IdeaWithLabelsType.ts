import { Idea, Label } from "@prisma/client";

export type IdeaWithRelationsType = Idea & {
  labels: Label[];
};
