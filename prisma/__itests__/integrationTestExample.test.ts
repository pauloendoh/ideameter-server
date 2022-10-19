import { beforeEach, describe, expect, it } from "vitest"
import AuthRepository from "../../src/domains/auth/AuthRepository"
import TabRepository from "../../src/domains/group/group-tab/TabRepository"
import GroupRepository from "../../src/domains/group/GroupRepository"
import IdeaRepository from "../../src/domains/idea/IdeaRepository"
import { buildIdeaWithRelations } from "../../src/types/domain/idea/IdeaWithRelationsType"

describe("IdeaRepository.i.test.ts", async () => {
  describe("when user creates a group, tab and idea", async () => {
    let authRepo: AuthRepository
    let groupRepo: GroupRepository
    let tabRepo: TabRepository
    let ideaRepo: IdeaRepository

    let user: Awaited<ReturnType<typeof authRepo.registerNewUser>>
    let group: Awaited<ReturnType<typeof groupRepo.createGroup>>
    let tab: Awaited<ReturnType<typeof tabRepo.createTab>>
    let idea: Awaited<ReturnType<typeof ideaRepo.saveIdea>>

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

      idea = await ideaRepo.saveIdea(
        buildIdeaWithRelations({ tabId: tab.id }),
        user.id
      )
    })

    describe("and when user deletes tab", () => {
      it("should not throw error", async () => {
        const sut = async () => {
          await tabRepo.deleteGroupTab(tab.id)
          return true
        }

        await expect(sut()).resolves.toBe(true)
      })
    })

    describe("and when an idea has high impact votes is deleted", () => {
      it("should not throw error", async () => {
        const asyncFn = async () => {
          const ideaWithVote = await ideaRepo.saveIdea(
            {
              ...idea,
              highImpactVotes: [{ ideaId: idea.id, userId: user.id }],
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