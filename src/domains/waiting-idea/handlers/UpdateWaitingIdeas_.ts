import ForbiddenError403 from "../../../utils/errors/ForbiddenError403"
import IdeaRepository from "../../idea/IdeaRepository"
import { WaitingIdeaRepository } from "../repositories/WaitingIdeaRepository"
import { WaitingIdeaDto } from "../types/WaitingIdeaDto"

export class UpdateWaitingIdeas_ {
  constructor(
    private readonly ideaRepo = new IdeaRepository(),
    private readonly waitingIdeaRepo = new WaitingIdeaRepository()
  ) {}

  async exec(input: {
    userId: string
    ideaId: string

    previousWaitingIdeas: WaitingIdeaDto[]
    newWaitingIdeas?: WaitingIdeaDto[]
  }) {
    const { userId, ideaId, previousWaitingIdeas, newWaitingIdeas = [] } = input

    const allIdeaIds = [
      input.ideaId,
      ...input.previousWaitingIdeas.map((idea) => idea.id),
      ...input.newWaitingIdeas.map((idea) => idea.id),
    ]

    const tabs = await this.ideaRepo.findTabsByIdeaIds(allIdeaIds)
    const userCanAccessTabs = await this.ideaRepo.userCanAccessTabs({
      requesterId: userId,
      tabIds: tabs.map((tab) => tab.id),
    })

    if (!userCanAccessTabs) {
      throw new ForbiddenError403("User does not have access to all tabs")
    }

    const previousWaitingIdeaIds = previousWaitingIdeas.map((idea) => idea.id)
    const newWaitingIdeaIds = newWaitingIdeas.map((idea) => idea.id)

    const waitingIdeasToDisconnect = previousWaitingIdeaIds.filter(
      (id) => !newWaitingIdeaIds.includes(id)
    )

    const waitingIdeasToConnect = newWaitingIdeaIds.filter(
      (id) => !previousWaitingIdeaIds.includes(id)
    )

    await this.waitingIdeaRepo.disconnectWaitingIdeas(
      ideaId,
      waitingIdeasToDisconnect
    )

    await this.waitingIdeaRepo.connectWaitingIdeas(
      ideaId,
      waitingIdeasToConnect
    )

    return {
      waitingIdeasToDisconnect,
      waitingIdeasToConnect,
    }
  }
}
