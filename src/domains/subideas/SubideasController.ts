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
  QueryParam,
} from "routing-controllers";
import { IdeaWithRelationsType } from "../../types/domain/idea/IdeaWithLabelsType";
import IdeaService from "../idea/IdeaService/IdeaService";

@JsonController("/subideas")
export class SubideasController {
  constructor(private ideaService = new IdeaService()) {}

  @Post()
  createSubidea(
    @CurrentUser({ required: true }) user: User,
    @Body() body: IdeaWithRelationsType
  ) {
    return this.ideaService.saveSubidea(body, user.id);
  }

  @Get()
  findSubideas(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("parentId") parentId: string,
    @QueryParam("groupId") groupId: string
  ) {
    if (groupId)
      return this.ideaService.findSubideasByGroupId(groupId, user.id);

    return this.ideaService.findSubideasByIdeaId(parentId, user.id);
  }

  @Put()
  updateSubidea(
    @CurrentUser({ required: true }) user: User,
    @Body() body: IdeaWithRelationsType
  ) {
    return this.ideaService.saveSubidea(body, user.id);
  }

  @Delete("/:subideaId")
  deleteSubidea(
    @CurrentUser({ required: true }) user: User,
    @Param("subideaId") subideaId: string
  ) {
    return this.ideaService.deleteSubidea(subideaId, user.id);
  }
}
