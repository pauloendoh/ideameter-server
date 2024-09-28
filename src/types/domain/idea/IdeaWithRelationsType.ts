import { HighImpactVote, Idea, Label } from "@prisma/client"

export type IdeaWithRelationsType = Idea & {
  labels: Label[]
  assignedUsers: SimpleUserDto[]
  highImpactVotes: HighImpactVote[]
  waitingIdeas: {
    id: string
    tabId: string

    name: string
    isDone: boolean
  }[]
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
  isArchived: false,
  tabId: "",
  name: "",
  description: "",
  isDone: false,
  completedAt: null,
  onFireSince: new Date(),
  irrelevantSince: new Date(),
  ratingsAreEnabled: true,
  subideaImageUrl: "",
  complexity: 1,
  frequencyRate: null,
  improvementRate: null,
  rewarding: null,
  discomfortZone: null,

  labels: [],
  assignedUsers: [],
  highImpactVotes: [],
  waitingIdeas: [],
  ...p,
})
