import { BadRequestError } from "routing-controllers"
import GroupRepository from "../../../GroupRepository"
import { CanRateForMeRepository } from "../CanRateForMeRepository"

export class $GetCanRateForMe {
  constructor(
    private readonly canRateForMeRepo = new CanRateForMeRepository(),
    private readonly groupRepo = new GroupRepository()
  ) {}

  async exec(input: { finalOwnerId: string; groupId: string }) {
    const isAllowed = await this.groupRepo.userBelongsToGroup({
      groupId: input.groupId,
      userId: input.finalOwnerId,
    })

    if (!isAllowed) {
      throw new BadRequestError("User does not belong to the group")
    }

    const items = await this.canRateForMeRepo.findByFinalOwnerAndGroup({
      finalOwnerId: input.finalOwnerId,
      groupId: input.groupId,
    })

    return items
  }
}
