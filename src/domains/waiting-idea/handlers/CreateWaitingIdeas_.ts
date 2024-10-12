import ForbiddenError403 from "../../../utils/errors/ForbiddenError403"
import IdeaRepository from "../../idea/IdeaRepository"
import { WaitingIdeaRepository } from "../repositories/WaitingIdeaRepository"
import { WaitingIdeaDto } from "../types/WaitingIdeaDto"

export class CreateWaitingIdeas_ {
  constructor(
    private readonly ideaRepo = new IdeaRepository(),
    private readonly waitingIdeasRepo = new WaitingIdeaRepository()
  ) {}

  async exec(input: {
    userId: string
    ideaId: string
    waitingIdeas?: WaitingIdeaDto[]
  }) {
    const { userId, ideaId, waitingIdeas = [] } = input

    if (waitingIdeas.length === 0) {
      return []
    }

    const allIdeaIds = [ideaId, ...waitingIdeas.map((idea) => idea.id)]

    const tabs = await this.ideaRepo.findTabsByIdeaIds(allIdeaIds)

    const userCanAccessTabs = await this.ideaRepo.userCanAccessTabs({
      requesterId: userId,
      tabIds: tabs.map((tab) => tab.id),
    })

    if (!userCanAccessTabs) {
      throw new ForbiddenError403("User does not have access to all tabs")
    }

    await this.waitingIdeasRepo.connectWaitingIdeas(
      ideaId,
      waitingIdeas.map((idea) => idea.id)
    )

    return waitingIdeas
  }
}
