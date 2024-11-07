import { User } from "@prisma/client"
import { CurrentUser, Get, JsonController, Param } from "routing-controllers"
import { $FindLastCommentInGroup } from "../comment/use-cases/$FindLastCommentInGroup"
import { InsightService } from "./InsightService/InsightService"
import { $FindGroupMembersLastRatings } from "./use-cases/$FindGroupMembersLastRatings"

@JsonController()
export class InsightController {
  constructor(
    private readonly insightService = new InsightService(),
    private readonly $findGroupMembersLastRatings = new $FindGroupMembersLastRatings(),
    private readonly $findLastCommentInGroup = new $FindLastCommentInGroup()
  ) {}

  @Get("/groups/:groupId/insights/interest-similarity")
  findInterestSimilarity(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.insightService.findInterestSimilarity(user.id, groupId)
  }

  @Get("/groups/:groupId/insights/missing-ratings")
  findMissingRatingsFromGroup(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.insightService.findMissingRatingsFromGroup(groupId, user.id)
  }

  @Get("/groups/:groupId/last-ratings")
  findLastRatingsFromGroup(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.$findGroupMembersLastRatings.execute({
      groupId,
      requesterId: user.id,
    })
  }

  @Get("/groups/:groupId/last-comments")
  findLastCommentsFromGroup(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.$findLastCommentInGroup.exec({
      groupId,
      requesterId: user.id,
    })
  }
}
