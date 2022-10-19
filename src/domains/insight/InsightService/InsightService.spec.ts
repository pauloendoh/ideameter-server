import { describe, expect, test } from "vitest"
import { InsightService } from "./InsightService"
describe("InsightService", () => {
  describe("calculateRatingSimilarityPercentage", () => {
    test("when ratingA is 1 and ratingB is 3 -> should return 0", async () => {
      const insightService = new InsightService()

      expect(insightService.calculateRatingSimilarityPercentage(1, 3)).toBe(0)
    })

    test("when ratingA is 2 and ratingB is 3 -> should return 50", async () => {
      const insightService = new InsightService()

      expect(insightService.calculateRatingSimilarityPercentage(2, 3)).toBe(0.5)
    })

    test("when ratingA is 3 and ratingB is 3 -> should return 1", async () => {
      const insightService = new InsightService()

      expect(insightService.calculateRatingSimilarityPercentage(3, 3)).toBe(1)
    })
  })
})
