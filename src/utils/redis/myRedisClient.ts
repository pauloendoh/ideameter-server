import { config } from "dotenv"
import Redis from "ioredis"
config()

const myRedisClient = new Redis(String(process.env.REDIS_URL))

export default myRedisClient
