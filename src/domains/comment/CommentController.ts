import { Comment, User } from "@prisma/client"
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  QueryParam,
} from "routing-controllers"
import { CommentService } from "./CommentService"

@JsonController()
export class CommentController {
  constructor(private commentService = new CommentService()) {}

  @Get("/comments")
  findMany(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("ideaId", { required: true }) ideaId: string
  ) {
    return this.commentService.findManyByIdeaId(ideaId, user.id)
  }

  @Post("/comments")
  saveComment(
    @CurrentUser({ required: true }) user: User,
    @Body() body: Comment
  ) {
    return this.commentService.save(body, user.id)
  }
}
