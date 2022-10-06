import { IdeaRating, User } from "@prisma/client";
import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers";
import RatingService from "./RatingService";

@JsonController()
export class RatingController {
  constructor(private ratingService = new RatingService()) {}

  @Get("/group/:groupId/ratings")
  findRatingsByGroupId(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.ratingService.findRatingsByGroupId(groupId, user.id);
  }

  @Post("/idea/:ideaId/rating")
  saveIdeaRating(
    @CurrentUser({ required: true }) user: User,
    @Param("ideaId") ideaId: string,
    @Body() body: IdeaRating
  ) {
    return this.ratingService.saveRating(body.ideaId, body.rating, user.id);
  }

  @Delete("/idea/:ideaId/rating")
  deleteIdeaRating(
    @CurrentUser({ required: true }) user: User,
    @Param("ideaId") ideaId: string
  ) {
    return this.ratingService.deleteIdeaRating(ideaId, user.id);
  }
}
