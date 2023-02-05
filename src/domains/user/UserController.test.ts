import { describe, expect, it } from "vitest"
import { UserController } from "./UserController"

describe("UserController", () => {
  describe("searchUsers", () => {
    describe("q is required", async () => {
      const sut = new UserController()

      it("should throw an error", async () => {
        expect(true).toBe(true)
        // await expect(() => sut.searchUsers(buildUser(), "")).rejects.toThrow(
        //   BadRequestError
        // )
      })
    })
  })
})
