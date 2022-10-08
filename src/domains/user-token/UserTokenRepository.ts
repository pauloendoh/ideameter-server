import { DateTime } from "luxon"
import myPrismaClient from "../../utils/myPrismaClient"
import { PasswordResetPostDto } from "../auth/types/PasswordResetPostDto"

export class UserTokenRepository {
  constructor(private prismaClient = myPrismaClient) {}

  deleteAllPasswordResetTokens(userId: string) {
    return this.prismaClient.userToken.deleteMany({
      where: {
        userId,
        type: "PASSWORD_RESET",
      },
    })
  }

  createPasswordResetToken(userId: string) {
    return this.prismaClient.userToken.create({
      data: {
        userId,
        type: "PASSWORD_RESET",
        expiresAt: DateTime.now().plus({ minutes: 15 }).toISO(),
      },
    })
  }

  passwordResetTokenExists(dto: PasswordResetPostDto) {
    return this.prismaClient.userToken.findFirst({
      where: {
        userId: dto.userId,
        token: dto.token,
        type: "PASSWORD_RESET",
        expiresAt: {
          gt: new Date().toISOString(),
        },
      },
    })
  }
}
