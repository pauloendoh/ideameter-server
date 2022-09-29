import { User } from "@prisma/client";
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
} from "routing-controllers";
import { MyAuthRequest } from "../../types/domain/auth/MyAuthRequest";
import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithRelationsType";
import IdeaService from "./IdeaService/IdeaService";

@JsonController()
export class IdeaController {
  constructor(private ideaService = new IdeaService()) {}

  @Delete("/idea/:ideaId")
  deleteIdea(
    @CurrentUser({ required: true }) user: User,
    @Param("ideaId") ideaId: string
  ) {
    return this.ideaService.deleteIdea(ideaId, user.id);
  }

  @Post("/group/:groupId/tab/:tabId/idea")
  createIdea(
    @CurrentUser({ required: true }) user: User,
    @Body() body: IdeaWithRelationsType,
    @Req() req: MyAuthRequest
  ) {
    const socketServer = req.app.get("socketio");
    return this.ideaService.createIdea(body, user.id, socketServer);
  }

  @Put("/group/:groupId/tab/:tabId/idea")
  updateIdea(
    @CurrentUser({ required: true }) user: User,
    @Body() body: IdeaWithRelationsType,
    @Req() req: MyAuthRequest
  ) {
    const socketServer = req.app.get("socketio");
    return this.ideaService.updateIdea(body, user.id, socketServer);
  }

  // PE 1/3 - not being used?
  @Get("/group/:groupId/tab/:tabId/idea")
  findIdeasByTabId(
    @CurrentUser({ required: true }) user: User,
    @Param("tabId") tabId: string
  ) {
    return this.ideaService.findIdeasByTabId(tabId, user.id);
  }

  @Get("/group/:groupId/ideas")
  findIdeasByGroupId(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.ideaService.findIdeasByGroupId(groupId, user.id);
  }

  @Get("/idea/:ideaId/name")
  findIdeaLinkPreviewInfo(@Param("ideaId") ideaId: string) {
    return this.ideaService.findIdeaLinkPreviewInfo(ideaId);
  }
}
