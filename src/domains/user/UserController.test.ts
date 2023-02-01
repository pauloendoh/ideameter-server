import { BadRequestError } from "routing-controllers"
import { describe, expect, it } from "vitest"
import { buildUser } from "../../utils/builders"
import { UserController } from "./UserController"

describe("UserController", () => {
  describe("searchUsers", () => {
    describe("q is required", async () => {
      const sut = new UserController()

      it("should throw an error", async () => {
        await expect(() => sut.searchUsers(buildUser(), "")).rejects.toThrow(
          BadRequestError
        )
      })
    })
  })
})
