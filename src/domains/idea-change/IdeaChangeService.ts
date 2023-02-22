import { Idea } from "@prisma/client"
import ForbiddenError403 from "../../utils/errors/ForbiddenError403"
import IdeaRepository from "../idea/IdeaRepository"
import { IdeaChangeRepository } from "./IdeaChangeRepository"

export class IdeaChangeService {
  constructor(
    private ideaChangeRepo = new IdeaChangeRepository(),
    private ideaRepo = new IdeaRepository()
  ) {}

  async findManyByIdeaId(ideaId: string, requesterId: string) {
    const isAllowed = await this.ideaRepo.userIdsCanAccessIdea(
      [requesterId],
      ideaId
    )
    if (!isAllowed) {
      throw new ForbiddenError403("You are not allowed to access this idea")
    }

    return this.ideaChangeRepo.findManyByIdeaId(ideaId)
  }

  async handleIdeaChange(params: {
    updatedIdea: Idea
    previousIdea: Idea
    requesterId: string
  }) {
    const { updatedIdea, previousIdea, requesterId } = params
    if (previousIdea.name !== updatedIdea.name) {
      await this.ideaChangeRepo.create({
        ideaId: updatedIdea.id,
        userId: requesterId,
        changeType: "Title",
        newText: updatedIdea.name,
        prevText: previousIdea.name,
      })
    }

    if (previousIdea.description !== updatedIdea.description) {
      await this.ideaChangeRepo.create({
        ideaId: updatedIdea.id,
        userId: requesterId,
        changeType: "Description",
        newText: updatedIdea.description,
        prevText: previousIdea.description,
      })
    }
  }
}
