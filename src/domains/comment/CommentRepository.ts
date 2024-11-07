import { Comment } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"
import { userSelectFields } from "../../utils/prisma/fields/user/userSelectFields"

export class CommentRepository {
  constructor(private readonly prisma = myPrismaClient) {}

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
      include: {
        user: {
          select: {
            ...userSelectFields,
          },
        },
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
      include: {
        user: {
          select: {
            ...userSelectFields,
          },
        },
      },
    })
  }

  findLastCommentsInGroup(groupId: string) {
    return this.prisma.comment.findMany({
      where: {
        targetIdea: {
          tab: {
            groupId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        createdAt: true,
        updatedAt: true,
        text: true,
        user: {
          select: {
            username: true,
            id: true,
            profile: {
              select: {
                pictureUrl: true,
              },
            },
          },
        },
        targetIdea: {
          select: {
            name: true,
            id: true,
            tabId: true,
          },
        },
      },
    })
  }
}
