import myPrismaClient from "../../utils/myPrismaClient"

export class SubideaRepository {
  constructor(private prisma = myPrismaClient) {}
}
