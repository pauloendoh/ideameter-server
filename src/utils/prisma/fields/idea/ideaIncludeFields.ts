import { userSelectFields } from "../user/userSelectFields";

// export const ideaIncludeFields: Prisma.IdeaSelect = {
export const ideaIncludeFields = {
  labels: true,
  assignedUsers: {
    select: userSelectFields,
  },
  highImpactVotes: true,
};
