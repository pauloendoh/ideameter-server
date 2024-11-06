import NotFoundError404 from "../../../utils/errors/NotFoundError404"
import UnauthorizedError401 from "../../../utils/errors/UnauthorizedError401"
import GroupRepository from "../../group/GroupRepository"
import RatingRepository from "../../rating/RatingRepository"

export class $FindGroupMembersLastRatings {
  constructor(
    private readonly groupRepository = new GroupRepository(),
    private readonly ratingRepository = new RatingRepository()
  ) {}

  async execute(params: { groupId: string; requesterId: string }) {
    const { groupId, requesterId } = params

    const foundGroup = await this.groupRepository.findGroupById(groupId)
    if (!foundGroup) {
      throw new NotFoundError404("Group not found")
    }

    const relations = await this.groupRepository.findGroupMembers(groupId)

    if (!relations.some((relation) => relation.userId === requesterId)) {
      throw new UnauthorizedError401("User is not a member of the group")
    }

    const memberIds = relations.map((relation) => relation.userId)

    const results = await this.ratingRepository.findLastRatingsByGroupMembers({
      groupId,
      userIds: memberIds,
    })

    return results
  }
}
