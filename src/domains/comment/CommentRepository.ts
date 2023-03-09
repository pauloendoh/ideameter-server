import { Comment } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"
import { userSelectFields } from "../../utils/prisma/fields/user/userSelectFields"

export class CommentRepository {
  constructor(private prisma = myPrismaClient) {}

  findByIdeaId(ideaId: string) {
    return this.prisma.comment.findMany({
      where: {
        targetIdeaId: ideaId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            ...userSelectFields,
          },
        },
      },
    })
  }

  create(comment: Comment, requesterId: string) {
    return this.prisma.comment.create({
      data: {
        ...comment,
        id: undefined,
        userId: requesterId,
        createdAt: undefined,
        updatedAt: undefined,
      },
    })
  }

  update(comment: Comment, requesterId: string) {
    return this.prisma.comment.update({
      where: {
        id: comment.id,
      },
      data: {
        ...comment,

        userId: requesterId,
        createdAt: undefined,
        updatedAt: undefined,
      },
    })
  }
}
