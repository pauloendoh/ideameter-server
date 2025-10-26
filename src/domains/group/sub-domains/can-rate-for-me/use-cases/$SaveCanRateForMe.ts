import { BadRequestError } from "routing-controllers"
import { CanRateForMeRepository } from "../CanRateForMeRepository"

export class $SaveCanRateForMe {
  constructor(
    private readonly canRateForMeRepo = new CanRateForMeRepository()
  ) {}

  async exec(input: {
    requesterId: string
    groupId: string
    canRate: boolean
    allowedMemberId: string
  }) {
    const alreadyCanRate = await this.canRateForMeRepo.alreadyCanRate({
      allowedMemberId: input.allowedMemberId,
      groupId: input.groupId,
      ownerId: input.requesterId,
    })

    if (!alreadyCanRate) {
      if (input.canRate === false) {
        throw new BadRequestError(
          "Cannot remove a permission that does not exist"
        )
      }

      return this.canRateForMeRepo.createCanRate({
        allowedMemberId: input.allowedMemberId,
        groupId: input.groupId,
        ownerId: input.requesterId,
      })
    }

    if (input.canRate) {
      throw new BadRequestError("Cannot add a permission that already exists")
    }

    return this.canRateForMeRepo.removeById(alreadyCanRate.id)
  }
}
