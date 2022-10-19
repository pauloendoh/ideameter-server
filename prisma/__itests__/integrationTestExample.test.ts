import { describe, expect, it } from "vitest"
import AuthRepository from "../../src/domains/auth/AuthRepository"
import TabRepository from "../../src/domains/group/group-tab/TabRepository"
import GroupRepository from "../../src/domains/group/GroupRepository"
import IdeaRepository from "../../src/domains/idea/IdeaRepository"
import { buildIdeaWithRelations } from "../../src/types/domain/idea/IdeaWithRelationsType"

describe("integration test example", async () => {
  describe("when an idea has high impact votes is deleted", () => {
    it("should not throw error", async () => {
      const fn = async () => {
        const authRepo = new AuthRepository()
        const groupRepo = new GroupRepository()
        const tabRepo = new TabRepository()
        const ideaRepo = new IdeaRepository()

        const user = await authRepo.registerNewUser(
          "test@test.com",
          "test",
          "lmao"
        )

        const group = await groupRepo.createGroup(
          { id: "", description: "", name: "group" },
          user.id
        )

        const tab = await tabRepo.createTab(group.id, "tab", user.id)

        const idea = await ideaRepo.saveIdea(
          buildIdeaWithRelations({ tabId: tab.id }),
          user.id
        )

        const ideaWithVote = await ideaRepo.saveIdea(
          {
            ...idea,
            highImpactVotes: [{ ideaId: idea.id, userId: user.id }],
          },
          user.id
        )

        await ideaRepo.deleteIdea(ideaWithVote.id)
      }

      await expect(fn()).resolves.toBe(true)
    })
  })
})
