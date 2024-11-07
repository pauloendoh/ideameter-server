import ForbiddenError403 from "../../../utils/errors/ForbiddenError403"
import GroupRepository from "../../group/GroupRepository"
import { CommentRepository } from "../CommentRepository"

export class $FindLastCommentInGroup {
  constructor(
    private readonly groupRepository = new GroupRepository(),
    private readonly commentRepository = new CommentRepository()
  ) {}

  async exec(params: { groupId: string; requesterId: string }) {
    const { groupId, requesterId } = params

    const userBelongsToGroup = await this.groupRepository.userBelongsToGroup({
      userId: requesterId,
      groupId,
    })

    if (!userBelongsToGroup) {
      throw new ForbiddenError403("User is not a member of the group")
    }

    const lastComments = await this.commentRepository.findLastCommentsInGroup(
      groupId
    )

    return lastComments
  }
}
