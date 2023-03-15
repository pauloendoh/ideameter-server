import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"
import { ArchivedIdeaService } from "./ArchivedIdeaService"

@JsonController()
export class ArchivedIdeaController {
  constructor(private archivedIdeaService = new ArchivedIdeaService()) {}

  @Get("/archived-ideas")
  getArchivedIdeas(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("groupId", { required: true }) groupId: string
  ) {
    return this.archivedIdeaService.findArchivedIdeasByGroupId({
      groupId,
      requesterId: user.id,
    })
  }
}
