import { IdeaRating, User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Req,
} from "routing-controllers"
import { MyAuthRequest } from "../../types/domain/auth/MyAuthRequest"
import RatingService from "./RatingService"

@JsonController()
export class RatingController {
  constructor(private ratingService = new RatingService()) {}

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
    @Body() body: IdeaRating,
    @Req() req: MyAuthRequest
  ) {
    const socketServer = req.app.get("socketio")

    return this.ratingService.saveRating(
      body.ideaId,
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
}
