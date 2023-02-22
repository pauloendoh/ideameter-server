import { User } from "@prisma/client"
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"
import { IdeaChangeService } from "./IdeaChangeService"

@JsonController()
export class IdeaChangeController {
  constructor(private ideaChangeService = new IdeaChangeService()) {}

  @Get("/idea-changes")
  findMany(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("ideaId", { required: true }) ideaId: string
  ) {
    return this.ideaChangeService.findManyByIdeaId(ideaId, user.id)
  }
}
