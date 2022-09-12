import myPrismaClient from "../../utils/myPrismaClient";

export class RteImageRepository {
  constructor(private rteImagePrisma = myPrismaClient.rteImage) {}

  async createRteImage(userId: string, imageUrl: string, ideaId?: string) {
    return this.rteImagePrisma.create({
      data: {
        imageUrl,
        userId,
        ideaId,
      },
    });
  }
}
