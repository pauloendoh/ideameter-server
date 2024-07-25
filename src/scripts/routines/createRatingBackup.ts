import myPrismaClient from "../../utils/myPrismaClient"

export async function createRatingBackup() {
  const ratings = await myPrismaClient.ideaRating.findMany({
    where: {
      ratingBackup: null,
    },
  })

  const ratingsBackup = ratings.map((rating) => ({
    ...rating,
    ratingBackup: rating.rating,
  }))

  await myPrismaClient.$transaction(
    ratingsBackup.map((ratingBackup) =>
      myPrismaClient.ideaRating.update({
        where: {
          id: ratingBackup.id,
        },
        data: {
          ratingBackup: ratingBackup.ratingBackup,
        },
      })
    )
  )
}
