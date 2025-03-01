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
import RatingService from "./RatingService"

@JsonController()
export class RatingController {
  constructor(private readonly ratingService = new RatingService()) {}

  @Get("/group/:groupId/ratings")
  findRatingsByGroupId(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.ratingService.findRatingsByGroupId(groupId, user.id)
  }

  @Post("/idea/:ideaId/rating")
  saveIdeaRating(
    @CurrentUser({ required: true }) user: User,
    @Param("ideaId") ideaId: string,
    @Body()
    body: {
      rating: number | null
    },
    @Req() req: MyAuthRequest
  ) {
    const socketServer = req.app.get("socketio")

    return this.ratingService.saveIdeaRating(
      ideaId,
      body.rating,
      user.id,
      socketServer
    )
  }

  @Delete("/idea/:ideaId/rating")
  deleteIdeaRating(
    @CurrentUser({ required: true }) user: User,
    @Param("ideaId") ideaId: string,
    @Req() req: MyAuthRequest
  ) {
    const socketServer = req.app.get("socketio")

    return this.ratingService.deleteIdeaRating(ideaId, user.id, socketServer)
  }

  @Put("/rating/:ratingId/refresh")
  refreshRating(
    @CurrentUser({ required: true }) user: User,
    @Param("ratingId") ratingId: string
  ) {
    return this.ratingService.refreshRating({
      ratingId: ratingId,
      requesterId: user.id,
    })
  }

  @Put("/rating/:ratingId/move-position")
  moveRatingPosition(
    @CurrentUser({ required: true }) user: User,
    @Param("ratingId") ratingId: string,
    @Body()
    body: {
      position: number | "first" | "last" | null
    }
  ) {
    return this.ratingService.moveRatingPosition({
      ratingId: ratingId,
      requesterId: user.id,
      position: body.position,
    })
  }
}
