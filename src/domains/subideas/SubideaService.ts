import { buildIdeaWithRelations } from "../../types/domain/idea/IdeaWithRelationsType"
import ForbiddenError403 from "../../utils/errors/ForbiddenError403"
import NotFoundError404 from "../../utils/errors/NotFoundError404"
import IdeaRepository from "../idea/IdeaRepository"
import { SubideaRepository } from "./SubideaRepository"

export class SubideaService {
  constructor(
    private subideaRepository = new SubideaRepository(),
    private ideaRepository = new IdeaRepository()
  ) {}

  async transformToSubidea(params: {
    ideaId: string
    newParentIdeaTitle: string
    requesterId: string
  }) {
    const { ideaId, newParentIdeaTitle, requesterId } = params

    const idea = await this.ideaRepository.findById(ideaId)
    if (!idea) {
      throw new NotFoundError404("Idea not found")
    }

    const canAccess = await this.ideaRepository.userCanAccessTab(
      idea.tabId,
      requesterId
    )

    if (!canAccess) {
      throw new ForbiddenError403("User does not have access.")
    }

    const newParentIdea = await this.ideaRepository.saveIdea(
      {
        ...buildIdeaWithRelations(),
        name: newParentIdeaTitle,
        tabId: idea.tabId,
      },
      requesterId
    )

    idea.parentId = newParentIdea.id
    idea.tabId = null

    await this.ideaRepository.saveIdea(idea, requesterId)

    return newParentIdea
  }
}
