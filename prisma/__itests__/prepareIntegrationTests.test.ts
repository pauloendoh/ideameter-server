import { afterAll, beforeAll, test } from "vitest"
import myPrismaClient from "../../src/utils/myPrismaClient"

test("", async () => {})

const clearEverything = async () => {
  const deleteUsers = myPrismaClient.user.deleteMany()
  const deleteGroup = myPrismaClient.group.deleteMany()

  await myPrismaClient.$transaction([deleteUsers, deleteGroup])
}

beforeAll(async () => {
  await clearEverything()
})

afterAll(async () => {
  await clearEverything()

  await myPrismaClient.$disconnect()
})
