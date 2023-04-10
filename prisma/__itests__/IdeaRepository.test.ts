import { describe, expect, it } from "vitest"
import { buildIdeaWithRelations } from "../../src/types/domain/idea/IdeaWithRelationsType"
import { getTestRepositories } from "./utils/getTestRepositories"

describe("IdeaRepository", () => {
  describe("saveIdea", () => {
    describe("when subideia with parentId is saved", async () => {
      it(
        "savedSubidea should have a parentId",
        async () => {
          // PE 1/3 - DRY integrationTestExample.test.ts
          let {
            authRepo,
            groupRepo,
            tabRepo,
            ideaRepo,
            user,
            group,
            tab,
            idea,
          } = await getTestRepositories()

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

          expect(savedSubidea.parentId).not.toBe(null)
        },
        {
          retry: 3,
        }
      )
    })
  })
})
