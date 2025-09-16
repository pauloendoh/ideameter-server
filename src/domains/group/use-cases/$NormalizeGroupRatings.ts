import RatingRepository from "../../rating/RatingRepository"

export class $NormalizeGroupRatings {
  constructor(private readonly ratingRepository = new RatingRepository()) {}

  async exec(params: {
    groupId: string
    oldMinMax: { min: number; max: number }
    newMinMax: { min: number; max: number }
  }) {
    const { groupId, oldMinMax, newMinMax } = params

    const prevIdeaRatings = await this.ratingRepository.findRatingsByGroupId(
      groupId
    )

    if (!prevIdeaRatings.length) {
      return
    }

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

    // TODO: maybe save in bulks, and emit web socket messages to front? Also, block new group changes while this is happening?
    const updatedRatings = await this.ratingRepository.updateManyRatings(
      newRatings
    )

    return updatedRatings
  }

  #normalizeRating(
    oldRating: number,
    oldMinMax: { min: number; max: number },
    newMinMax: { min: number; max: number }
  ) {
    // example: value 4 when min 1 max 5 -> value 2.5 when min 1 max 3
    const oldRange = oldMinMax.max - oldMinMax.min // 5 - 1 = 4
    const newRange = newMinMax.max - newMinMax.min // 3 - 1 = 2

    return (
      ((oldRating - oldMinMax.min) * newRange) / oldRange + newMinMax.min
      // ((4 - 1) * 2) / 4 + 1 = 2.5
    )
  }
}
