import { Action } from "routing-controllers"
import myRedisClient from "../redis/myRedisClient"
import { redisKeys } from "../redis/redisKeys"
import { validateJwt } from "./validateJwt"

export const myCurrentUserChecker = async (action: Action) => {
  const token = action.request.headers["x-auth-token"]
  const user = await validateJwt(token)

  myRedisClient.set(redisKeys.userLastOnline(user.id), new Date().toISOString())

  return user
}
