import { config } from "dotenv"
import Redis from "ioredis"
config()

const myRedisClient = new Redis(String(process.env.REDIS_URL), {
  reconnectOnError: (err) => {
    // const targetError = "READONLY"
    // if (err.message.slice(0, targetError.length) === targetError) {
    //   // Only reconnect when the error starts with "READONLY"
    //   return true // or `return 1;`
    // }

    return false
  },
})

export default myRedisClient
