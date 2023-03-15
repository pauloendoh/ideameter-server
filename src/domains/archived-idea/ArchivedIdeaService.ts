import { ForbiddenError } from "routing-controllers"
import GroupRepository from "../group/GroupRepository"
import IdeaRepository from "../idea/IdeaRepository"

export class ArchivedIdeaService {
  constructor(
    private ideaRepo = new IdeaRepository(),
    private groupRepo = new GroupRepository()
  ) {}

  async findArchivedIdeasByGroupId(params: {
    groupId: string
    requesterId: string
  }) {
    const { groupId, requesterId } = params

    const isAllowed = await this.groupRepo.userIsAllowedOrThrow(
      requesterId,
      groupId
    )

    if (!isAllowed) {
      throw new ForbiddenError("User is not allowed to access this group")
    }

    return this.ideaRepo.findArchivedIdeasByGroupId(groupId)
  }
}
