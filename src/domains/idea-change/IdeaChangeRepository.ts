import { Prisma } from "@prisma/client"
import myPrismaClient from "../../utils/myPrismaClient"

export class IdeaChangeRepository {
  constructor(private prisma = myPrismaClient) {}

  findManyByIdeaId(ideaId: string) {
    return this.prisma.ideaChange.findMany({
      where: { ideaId },
    })
  }

  create(dto: Prisma.IdeaChangeUncheckedCreateInput) {
    return this.prisma.ideaChange.create({ data: dto })
  }
}
