import { BadRequestError } from "routing-controllers"
import { $GhostRating } from "../../../../_domain-models/$GhostRating"
import { GhostRatingRepository } from "../GhostRatingRepository"

export class $SaveGhostRating {
  constructor(private readonly ghostRatingRepo = new GhostRatingRepository()) {}

  async exec(input: {
    requesterId: string
    targetUserId: string
    ideaId: string
    rating: number | null
  }): Promise<$GhostRating> {
    const foundGhostRating = await this.ghostRatingRepo.findAlreadyGhostRated({
      ownerId: input.requesterId,
      targetUserId: input.targetUserId,
      ideaId: input.ideaId,
    })

    if (foundGhostRating) {
      if (input.rating === null) {
        return this.ghostRatingRepo.deleteGhostRating(foundGhostRating.id)
      }

      foundGhostRating.rating = input.rating

      return this.ghostRatingRepo.updateGhostRating(foundGhostRating.id, {
        rating: input.rating,
      })
    }

    if (input.rating === null) {
      throw new BadRequestError(
        "Cannot delete a ghost rating that does not exist"
      )
    }

    const newGhostRating = new $GhostRating({
      ideaId: input.ideaId,
      rating: input.rating,
      userId: input.requesterId,
      targetUserId: input.targetUserId,
    })

    return this.ghostRatingRepo.createGhostRating(newGhostRating)
  }
}
