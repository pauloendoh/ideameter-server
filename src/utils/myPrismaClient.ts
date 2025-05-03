import { PrismaClient } from "@prisma/client"

// unique prisma client to avoid error
// "FATAL: sorry, too many clients already"
const myPrismaClient = new PrismaClient()
export default myPrismaClient
