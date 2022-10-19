import { HighImpactVote, Idea, Label } from "@prisma/client"

export type IdeaWithRelationsType = Idea & {
  labels: Label[]
  assignedUsers: SimpleUserDto[]
  highImpactVotes: HighImpactVote[]
}

export type SimpleUserDto = {
  id: string
  username: string
  email: string
}

export const buildIdeaWithRelations = (
  p?: Partial<IdeaWithRelationsType>
): IdeaWithRelationsType => ({
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  parentId: "",
  creatorId: "",
  tabId: "",
  name: "",
  description: "",
  isDone: false,
  onFireSince: new Date(),
  irrelevantSince: new Date(),

  labels: [],
  assignedUsers: [],
  highImpactVotes: [],
  ...p,
})
