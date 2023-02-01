import { User } from "@prisma/client"

export const buildUser = (p?: Partial<User>): User => ({
  id: "",
  googleId: "",
  username: "",
  email: "",
  password: "",
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastOpenedGroupId: "",
  ...p,
})
