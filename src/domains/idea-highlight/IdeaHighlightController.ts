import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  Post,
  QueryParam,
} from "routing-controllers"
import { IdeaHighlightService } from "./IdeaHighlightService"

@JsonController()
export class IdeaHighlightController {
  constructor(private ideaHighlightService = new IdeaHighlightService()) {}

  @Get("/highlightable-ideas")
  findHighlightableIdeas(@CurrentUser({ required: true }) user: User) {
    return this.ideaHighlightService.findHighlightableIdeas(user.id)
  }

  @Get("/idea-highlights")
  findIdeaHighlights(@CurrentUser({ required: true }) user: User) {
    return this.ideaHighlightService.findIdeaHighlights(user.id)
  }

  @Post("/toggle-idea-highlight")
  toggleIdeaHighlight(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("ideaId", { required: true }) ideaId: string
  ) {
    return this.ideaHighlightService.toggleIdeaHighlight({
      userId: user.id,
      ideaId,
    })
  }
}
