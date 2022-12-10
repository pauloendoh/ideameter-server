import { describe, expect, it } from "vitest"
import AuthRepository from "../../src/domains/auth/AuthRepository"
import TabRepository from "../../src/domains/group/group-tab/TabRepository"
import GroupRepository from "../../src/domains/group/GroupRepository"
import IdeaRepository from "../../src/domains/idea/IdeaRepository"
import { buildIdeaWithRelations } from "../../src/types/domain/idea/IdeaWithRelationsType"

describe("IdeaRepository", () => {
  describe("saveIdea", () => {
    describe("when subideia with parentId is saved", async () => {
      // PE 1/3 - DRY integrationTestExample.test.ts
      const authRepo = new AuthRepository()
      const groupRepo = new GroupRepository()
      const tabRepo = new TabRepository()
      const ideaRepo = new IdeaRepository()

      let user: Awaited<ReturnType<typeof authRepo.registerNewUser>>
      let group: Awaited<ReturnType<typeof groupRepo.createGroup>>
      let tab: Awaited<ReturnType<typeof tabRepo.createTab>>
      let idea: Awaited<ReturnType<typeof ideaRepo.saveIdea>>

      let username = new Date().toISOString()
      user = await authRepo.registerNewUser(
        username + "@test.com",
        username,
        "lmao"
      )

      group = await groupRepo.createGroup(
        { id: "", description: "", name: "group" },
        user.id
      )

      tab = await tabRepo.createTab(group.id, "tab", user.id)

      idea = await ideaRepo.saveIdea(
        buildIdeaWithRelations({ tabId: tab.id }),
        user.id
      )

      const savedSubidea = await ideaRepo.saveIdea(
        {
          ...buildIdeaWithRelations({ tabId: tab.id }),
          parentId: idea.id,
        },
        user.id
      )
      it("savedSubidea should have a parentId", () => {
        expect(savedSubidea.parentId).not.toBe(null)
      })
    })
  })
})
