import myPrismaClient from "../../utils/myPrismaClient"

export class RteImageRepository {
  constructor(private readonly rteImagePrisma = myPrismaClient.rteImage) {}

  async createRteImage(userId: string, imageUrl: string, ideaId?: string) {
    return this.rteImagePrisma.create({
      data: {
        imageUrl,
        userId,
        ideaId,
      },
    })
  }
}
