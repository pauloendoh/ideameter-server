import { Action } from "routing-controllers"
import UserRepository from "../../domains/user/UserRepository"
import { validateJwt } from "./validateJwt"

export const myCurrentUserChecker = async (action: Action) => {
  const token = action.request.headers["x-auth-token"]
  const user = await validateJwt(token)

  try {
    userRepo.updateLastOnlineAt(user.id)
  } catch (e) {
    console.log(e)
  }

  return user
}

const userRepo = new UserRepository()
