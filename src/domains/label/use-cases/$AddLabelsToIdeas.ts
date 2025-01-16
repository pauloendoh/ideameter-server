import { BadRequestError } from "routing-controllers"
import ForbiddenError403 from "../../../utils/errors/ForbiddenError403"
import NotFoundError404 from "../../../utils/errors/NotFoundError404"
import GroupRepository from "../../group/GroupRepository"
import IdeaRepository from "../../idea/IdeaRepository"

export class $AddLabelsToIdeas {
  constructor(
    private readonly groupRepo = new GroupRepository(),
    private readonly ideaRepo = new IdeaRepository()
  ) {}

  async exec(input: {
    labelIds: string[]
    ideaIds: string[]
    requesterId: string
  }) {
    const foundGroups = await this.groupRepo.findGroupsByIdeasAndLabels({
      ideaIds: input.ideaIds,
      labelIds: input.labelIds,
    })

    if (!foundGroups.length) {
      throw new NotFoundError404("No groups found")
    }

    if (foundGroups.length > 1) {
      throw new BadRequestError("Multiple groups found")
    }

    const group = foundGroups[0]

    const userHasAccessToGroup = await this.groupRepo.userHasAccessToGroup({
      groupId: group.id,
      userId: input.requesterId,
    })

    if (!userHasAccessToGroup) {
      throw new ForbiddenError403("User does not have access to this group")
    }

    const hasSubideas = await this.ideaRepo.isSubidea(input.ideaIds)
    if (hasSubideas) {
      throw new BadRequestError("Cannot add labels to subideas")
    }

    await this.ideaRepo.addLabelsToIdeas({
      labelIds: input.labelIds,
      ideaIds: input.ideaIds,
    })

    return this.ideaRepo.findIdeasByIds(input.ideaIds)
  }
}
