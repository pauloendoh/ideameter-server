import { HighImpactVote, Idea, Label } from "@prisma/client";

export type IdeaWithRelationsType = Idea & {
  labels: Label[];
  assignedUsers: SimpleUserDto[];
  highImpactVotes: HighImpactVote[];
};

export type SimpleUserDto = {
  id: string;
  username: string;
  email: string;
};
