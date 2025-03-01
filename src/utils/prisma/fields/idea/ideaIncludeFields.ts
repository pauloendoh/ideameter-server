import { Prisma } from "@prisma/client"
import { userSelectFields } from "../user/userSelectFields"
import { waitingIdeasSelectFields } from "../waitingIdeasSelectFields"

export const ideaIncludeFields = {
  labels: true,
  assignedUsers: {
    select: userSelectFields,
  },
  highImpactVotes: true,
  waitingIdeas: {
    select: waitingIdeasSelectFields,
  },
  beingWaitedFor: {
    select: waitingIdeasSelectFields,
  },
} satisfies Prisma.IdeaSelect
