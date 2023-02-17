import { Action } from "routing-controllers"
import { validateJwt } from "./validateJwt"

export const myCurrentUserChecker = async (action: Action) => {
  const token = action.request.headers["x-auth-token"]
  const user = await validateJwt(token)

  try {
    // myRedisClient.set(
    //   redisKeys.userLastOnline(user.id),
    //   new Date().toISOString()
    // )
  } catch (e) {
    console.log(e)
  }

  return user
}
