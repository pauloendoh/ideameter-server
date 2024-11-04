import RatingRepository from "../../rating/RatingRepository"

export class $NormalizeGroupRatings {
  constructor(private readonly ratingRepository = new RatingRepository()) {}

  async normalizeGroupRatings(params: {
    groupId: string
    oldMinMax: { min: number; max: number }
    newMinMax: { min: number; max: number }
  }) {
    const { groupId, oldMinMax, newMinMax } = params

    const prevIdeaRatings = await this.ratingRepository.findRatingsByGroupId(
      groupId
    )

    if (!prevIdeaRatings.length) return

    const newRatings = prevIdeaRatings.map((ir) => {
      const normalizedRating = this.#normalizeRating(
        ir.rating,
        oldMinMax,
        newMinMax
      )

      return {
        id: ir.id,
        rating: normalizedRating,
      }
    })

    const updatedRatings = await this.ratingRepository.updateManyRatings(
      newRatings
    )

    return updatedRatings
  }

  #normalizeRating(
    currentRating: number,
    oldMinMax: { min: number; max: number },
    newMinMax: { min: number; max: number }
  ) {
    // example: value 2, min 1, max 3 -> value 3, min 1, max 5
    const oldRange = oldMinMax.max - oldMinMax.min // 3 - 1 = 2
    const newRange = newMinMax.max - newMinMax.min // 5 - 1 = 4

    return (
      ((currentRating - oldMinMax.min) * newRange) / oldRange + newMinMax.min
      // (2 - 1) * 4 / 2 + 1
      // (4 / 2) + 1 = 3
    )
  }
}
