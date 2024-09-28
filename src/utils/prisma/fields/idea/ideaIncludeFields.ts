import { userSelectFields } from "../user/userSelectFields"
import { waitingIdeasSelectFields } from "../waitingIdeasSelectFields"

// export const ideaIncludeFields: Prisma.IdeaSelect = {
export const ideaIncludeFields = {
  labels: true,
  assignedUsers: {
    select: userSelectFields,
  },
  highImpactVotes: true,
  waitingIdeas: {
    select: waitingIdeasSelectFields,
  },
}
