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
  QueryParam,
} from "routing-controllers"
import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithRelationsType"
import IdeaService from "../idea/IdeaService/IdeaService"
import { SubideaService } from "./SubideaService"

@JsonController("/subideas")
export class SubideasController {
  constructor(
    private ideaService = new IdeaService(),
    private subideaService = new SubideaService()
  ) {}

  @Post()
  createSubidea(
    @CurrentUser({ required: true }) user: User,
    @Body() body: IdeaWithRelationsType
  ) {
    return this.ideaService.saveSubidea(body, user.id)
  }

  @Get()
  findSubideas(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("parentId") parentId: string,
    @QueryParam("groupId") groupId: string
  ) {
    if (groupId) return this.ideaService.findSubideasByGroupId(groupId, user.id)

    return this.ideaService.findSubideasByIdeaId(parentId, user.id)
  }

  @Put()
  updateSubidea(
    @CurrentUser({ required: true }) user: User,
    @Body() body: IdeaWithRelationsType
  ) {
    return this.ideaService.saveSubidea(body, user.id)
  }

  @Delete("/:subideaId")
  deleteSubidea(
    @CurrentUser({ required: true }) user: User,
    @Param("subideaId") subideaId: string
  ) {
    return this.ideaService.deleteSubidea(subideaId, user.id)
  }

  @Post("/transform-to-subidea")
  transformToSubidea(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("ideaId", { required: true }) ideaId: string,
    @QueryParam("newParentIdeaTitle", { required: true })
    newParentIdeaTitle: string
  ) {
    return this.subideaService.transformToSubidea({
      ideaId,
      newParentIdeaTitle,
      requesterId: user.id,
    })
  }
}
