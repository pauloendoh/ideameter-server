import { User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers"
import { $GhostRating } from "../../../_domain-models/$GhostRating"
import { $GetUserGhostRatings } from "./use-cases/$GetUserGhostRatings"
import { $SaveGhostRating } from "./use-cases/$SaveGhostRating"

@JsonController()
export class GhostRatingController {
  constructor(
    private readonly $saveGhostRating = new $SaveGhostRating(),
    private readonly $getUserGhostRatings = new $GetUserGhostRatings()
  ) {}

  @Get("/groups/:groupId/ghost-ratings")
  async getGhostRatingsByGroupAndUser(
    @CurrentUser({ required: true }) requester: User,
    @Param("groupId") groupId: string
  ): Promise<$GhostRating[]> {
    return this.$getUserGhostRatings.exec({
      groupId,
      userId: requester.id,
    })
  }

  @Post("/ideas/:ideaId/ghost-ratings")
  saveGhostRating(
    @CurrentUser({ required: true }) requester: User,
    @Param("ideaId") ideaId: string,
    @Body() body: { rating: number | null; targetUserId: string }
  ): Promise<$GhostRating> {
    return this.$saveGhostRating.exec({
      ideaId,
      rating: body.rating,
      requesterId: requester.id,
      targetUserId: body.targetUserId,
    })
  }
}
