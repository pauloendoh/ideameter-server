import { beforeEach, describe, expect, it } from "vitest"
import AuthRepository from "../../../src/domains/auth/AuthRepository"
import GroupRepository from "../../../src/domains/group/GroupRepository"
import TabRepository from "../../../src/domains/group/group-tab/TabRepository"
import IdeaRepository from "../../../src/domains/idea/IdeaRepository"
import { buildIdeaWithRelations } from "../../../src/types/domain/idea/IdeaWithRelationsType"
import { getTestRepositories } from "./getTestRepositories"

describe("IdeaRepository.i.test.ts", async () => {
  describe("when user creates a group, tab and idea", async () => {
    let { authRepo, groupRepo, tabRepo, ideaRepo, user, group, tab, idea } =
      await getTestRepositories()

    beforeEach(async () => {
      authRepo = new AuthRepository()
      groupRepo = new GroupRepository()
      tabRepo = new TabRepository()
      ideaRepo = new IdeaRepository()

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

      idea = await ideaRepo.upsertIdea(
        buildIdeaWithRelations({ tabId: tab.id }),
        user.id
      )
    })

    describe("and when user deletes tab", () => {
      it(
        "should not throw error",
        async () => {
          const sut = async () => {
            await tabRepo.deleteGroupTab(tab.id)
            return true
          }

          await expect(sut()).resolves.toBe(true)
        },
        {
          retry: 3,
        }
      )
    })

    describe("and when an idea has high impact votes is deleted", () => {
      it("should not throw error", async () => {
        const asyncFn = async () => {
          const ideaWithVote = await ideaRepo.upsertIdea(
            {
              ...idea,
              highImpactVotes: [
                {
                  ideaId: idea.id,
                  userId: user.id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            },
            user.id
          )

          await ideaRepo.deleteIdea(ideaWithVote.id)

          return true
        }

        await expect(asyncFn()).resolves.toBe(true)
      })
    })
  })
})
