import { User } from "@prisma/client";
import { CurrentUser, Get, JsonController, Param } from "routing-controllers";
import { InsightService } from "./InsightService";

@JsonController()
export class InsightController {
  constructor(private insightService = new InsightService()) {}

  @Get("/groups/:groupId/insights/interest-similarity")
  findInterestSimilarity(
    @CurrentUser({ required: true }) user: User,
    @Param("groupId") groupId: string
  ) {
    return this.insightService.findInterestSimilarity(user.id, groupId);
  }
}
