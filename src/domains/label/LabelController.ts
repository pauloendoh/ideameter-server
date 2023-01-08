import { Label, User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
} from "routing-controllers"
import LabelService from "./LabelService"
import { ImportLabelDto } from "./types/ImportLabelDto"

@JsonController()
export class LabelController {
  constructor(private labelService = new LabelService()) {}

  @Delete("/labels/:labelId")
  deleteLabel(
    @CurrentUser({ required: true }) user: User,
    @Param("labelId") labelId: string
  ) {
    return this.labelService.deleteLabel(labelId, user.id)
  }

  @Get("/group/:groupId/labels")
  findLabelsByGroup(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.labelService.findLabelsByGroup(groupId, user.id)
  }

  @Post("/group/:groupId/labels")
  createLabel(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string,
    @Body() body: Label
  ) {
    return this.labelService.createLabel(body, groupId, user.id)
  }

  @Put("/group/:groupId/labels")
  editLabel(@CurrentUser({ required: true }) user: User, @Body() body: Label) {
    return this.labelService.updateLabel(body, user.id)
  }

  @Get("/group/:groupId/labels-to-import")
  findLabelsToImport(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.labelService.findLabelsToImport(groupId, user.id)
  }

  @Post("/group/:groupId/import-labels")
  importLabels(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string,
    @Body({ required: true }) labelDtos: ImportLabelDto[]
  ) {
    return this.labelService.importLabels({
      labelDtos,
      groupId,
      requesterId: user.id,
    })
  }
}
