import { IdeaHighlightRepository } from "./IdeaHighlightRepository"

export class IdeaHighlightService {
  constructor(private ideaHighlightRepo = new IdeaHighlightRepository()) {}

  async findHighlightableIdeas(requesterId: string) {
    return this.ideaHighlightRepo.findHighlightableIdeas(requesterId)
  }

  async findIdeaHighlights(requesterId: string) {
    return this.ideaHighlightRepo.findIdeaHighlights(requesterId)
  }

  async toggleIdeaHighlight(params: { userId: string; ideaId: string }) {
    const { userId, ideaId } = params
    const userOwns = await this.ideaHighlightRepo.findUserOwns({
      userId,
      ideaId,
    })
    if (userOwns) {
      await this.ideaHighlightRepo.delete({ userId, ideaId })
      return "deleted"
    }

    return this.ideaHighlightRepo.create({ userId, ideaId })
  }
}
