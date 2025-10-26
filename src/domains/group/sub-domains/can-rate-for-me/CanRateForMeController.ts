import { User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers"
import { $GetCanRateForMe } from "./use-cases/$GetCanRateForMe"
import { $SaveCanRateForMe } from "./use-cases/$SaveCanRateForMe"

@JsonController()
export class CanRateForMeController {
  constructor(
    private readonly $saveGhostRating = new $SaveCanRateForMe(),
    private readonly $getCanRateForMe = new $GetCanRateForMe()
  ) {}

  @Get("/groups/:groupId/can-rate-for-me")
  async getCanRateForMe(
    @CurrentUser({ required: true }) requester: User,
    @Param("groupId") groupId: string
  ) {
    return this.$getCanRateForMe.exec({
      groupId,
      finalOwnerId: requester.id,
    })
  }

  @Post("/groups/:groupId/can-rate-for-me")
  saveCanRateForMe(
    @CurrentUser({ required: true }) requester: User,
    @Body() body: { canRate: boolean; allowedMemberId: string },
    @Param("groupId") groupId: string
  ) {
    return this.$saveGhostRating.exec({
      allowedMemberId: body.allowedMemberId,
      canRate: body.canRate,
      groupId: groupId,
      requesterId: requester.id,
    })
  }
}
