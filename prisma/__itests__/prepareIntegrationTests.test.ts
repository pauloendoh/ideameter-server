import { afterAll, beforeAll, test } from "vitest"
import myPrismaClient from "../../src/utils/myPrismaClient"

test("", async () => {})

const clearEverything = async () => {
  const deleteUsers = myPrismaClient.user.deleteMany()

  await myPrismaClient.$transaction([deleteUsers])
}

beforeAll(async () => {
  await clearEverything()
})

afterAll(async () => {
  await clearEverything()

  await myPrismaClient.$disconnect()
})
