import { afterAll, beforeAll, test } from "vitest"
import myPrismaClient from "../../../src/utils/myPrismaClient"

test("", async () => {})

const clearEverything = async () => {
  await myPrismaClient.idea.deleteMany()
  await myPrismaClient.groupTab.deleteMany()
  await myPrismaClient.group.deleteMany()
  await myPrismaClient.user.deleteMany()
}

beforeAll(async () => {
  await clearEverything()
})

afterAll(async () => {
  await clearEverything()

  await myPrismaClient.$disconnect()
})
