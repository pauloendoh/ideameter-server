import myPrismaClient from "../../../utils/myPrismaClient"

export class WaitingIdeaRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  async disconnectWaitingIdeas(ideaId: string, disconnectIdeaIds: string[]) {
    await this.prismaClient.idea.update({
      data: {
        waitingIdeas: {
          disconnect: disconnectIdeaIds.map((id) => ({ id })),
        },
      },
      where: {
        id: ideaId,
      },
    })
  }

  async connectWaitingIdeas(ideaId: string, connectIdeaIds: string[]) {
    await this.prismaClient.idea.update({
      data: {
        waitingIdeas: {
          connect: connectIdeaIds.map((id) => ({ id })),
        },
      },
      where: {
        id: ideaId,
      },
    })
  }
}
