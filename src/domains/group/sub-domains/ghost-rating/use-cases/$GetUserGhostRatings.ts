import { BadRequestError } from "routing-controllers"
import { $GhostRating } from "../../../../_domain-models/$GhostRating"
import GroupRepository from "../../../GroupRepository"
import { GhostRatingRepository } from "../GhostRatingRepository"

export class $GetUserGhostRatings {
  constructor(
    private readonly ghostRatingRepo = new GhostRatingRepository(),
    private readonly groupRepo = new GroupRepository()
  ) {}

  async exec(input: {
    userId: string
    groupId: string
  }): Promise<$GhostRating[]> {
    const isAllowed = await this.groupRepo.userBelongsToGroup({
      groupId: input.groupId,
      userId: input.userId,
    })

    if (!isAllowed) {
      throw new BadRequestError("User does not belong to the group")
    }

    const ghostRatings =
      await this.ghostRatingRepo.findGhostRatingsByUserAndGroup({
        userId: input.userId,
        groupId: input.groupId,
      })

    return ghostRatings
  }
}
