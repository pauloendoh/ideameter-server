import Prisma from "@prisma/client"
import { randomUUID } from "node:crypto"
import { z } from "zod"
import { MyUnsafeZod } from "../../types/my-zod"

export const $ghostRatingSchema = z.object({
  createdAt: z.date(),
  id: z.string().default(randomUUID()),
  ideaId: z.string(),
  rating: z.number(),
  updatedAt: z.date(),
  userId: z.string(),
  targetUserId: z.string(),
} satisfies MyUnsafeZod<$GhostRating>)

export type $GhostRatingSchema = z.infer<typeof $ghostRatingSchema>

export class $GhostRating implements Prisma.GhostRating {
  id: string
  userId: string
  ideaId: string
  targetUserId: string

  createdAt: Date
  updatedAt: Date
  rating: number

  constructor(required: {
    userId: string
    ideaId: string
    rating: number
    targetUserId: string
  }) {
    this.id = randomUUID()
    this.userId = required.userId
    this.ideaId = required.ideaId
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.rating = required.rating
    this.targetUserId = required.targetUserId
  }
}

export class $GhostRatingWithRelations extends $GhostRating {
  idea?: Prisma.Idea
  user?: Prisma.User
}
