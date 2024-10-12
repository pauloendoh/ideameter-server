import AuthRepository from "../../../src/domains/auth/AuthRepository"
import GroupRepository from "../../../src/domains/group/GroupRepository"
import TabRepository from "../../../src/domains/group/group-tab/TabRepository"
import IdeaRepository from "../../../src/domains/idea/IdeaRepository"

export const getTestRepositories = async () => {
  const authRepo = new AuthRepository()
  const groupRepo = new GroupRepository()
  const tabRepo = new TabRepository()
  const ideaRepo = new IdeaRepository()

  let user: Awaited<ReturnType<typeof authRepo.registerNewUser>>
  let group: Awaited<ReturnType<typeof groupRepo.createGroup>>
  let tab: Awaited<ReturnType<typeof tabRepo.createTab>>
  let idea: Awaited<ReturnType<typeof ideaRepo.upsertIdea>>

  return {
    authRepo,
    groupRepo,
    tabRepo,
    ideaRepo,

    user,
    group,
    tab,
    idea,
  }
}
