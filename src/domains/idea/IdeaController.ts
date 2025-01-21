import { User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Req,
} from "routing-controllers"
import { MyAuthRequest } from "../../types/domain/auth/MyAuthRequest"
import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithRelationsType"
import IdeaService from "./IdeaService/IdeaService"
import { MoveIdeasToTabDto } from "./types/MoveIdeasToTabDto"

@JsonController()
export class IdeaController {
  constructor(private readonly ideaService = new IdeaService()) {}

  @Delete("/idea/:ideaId")
  deleteIdea(
    @CurrentUser({ required: true }) user: User,
    @Param("ideaId") ideaId: string
  ) {
    return this.ideaService.deleteIdea(ideaId, user.id)
  }

  @Post("/group/:groupId/tab/:tabId/idea")
  createIdea(
    @CurrentUser({ required: true }) user: User,
    @Body() body: IdeaWithRelationsType
  ) {
    return this.ideaService.createIdea(body, user.id)
  }

  @Put("/group/:groupId/tab/:tabId/idea")
  updateIdea(
    @CurrentUser({ required: true }) user: User,
    @Body() body: IdeaWithRelationsType,
    @Req() req: MyAuthRequest
  ) {
    const socketServer = req.app.get("socketio")
    return this.ideaService.updateIdea(body, user.id, socketServer)
  }

  @Get("/group/:groupId/ideas")
  findIdeasByGroupId(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.ideaService.findIdeasByGroupId(groupId, user.id)
  }

  @Get("/idea/:ideaId/name")
  async findIdeaLinkPreviewInfo(@Param("ideaId") ideaId: string) {
    const data = await this.ideaService.findIdeaLinkPreviewInfo(ideaId)
    console.log({ data })
    return data
  }

  @Put("/ideas/move-to-tab")
  moveIdeasToTab(
    @CurrentUser({ required: true }) user: User,
    @Body() body: MoveIdeasToTabDto,
    @Req() req: MyAuthRequest
  ) {
    const socketServer = req.app.get("socketio")

    return this.ideaService.moveIdeasToTab(body, user.id)
  }

  @Get("/ideas/assigned-to-me")
  findIdeasAssignedToMe(@CurrentUser({ required: true }) user: User) {
    return this.ideaService.findAssignedIdeasToUser(user.id)
  }

  @Get("/ideas/high-impact-voted-by-me")
  findHighImpactVotedByMe(@CurrentUser({ required: true }) user: User) {
    return this.ideaService.findHighImpactVotedByMe(user.id)
  }

  @Get("/ideas/highly-rated-ideas-by-me")
  findHighlyRatedIdeasByMe(@CurrentUser({ required: true }) user: User) {
    return this.ideaService.findHighlyRatedIdeas(user.id)
  }
}
