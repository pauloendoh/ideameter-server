import myPrismaClient from "../../utils/myPrismaClient";

export default class AuthRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  public async emailExists(email: string): Promise<boolean> {
    const user = await this.prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    return !!user;
  }

  public async registerNewUser(
    email: string,
    username: string,
    hashedPassword: string
  ) {
    const newUser = await this.prismaClient.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        profile: {
          create: {
            bio: "",
            pictureUrl: "",
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return newUser;
  }

  public async usernameExists(username: string): Promise<boolean> {
    const user = await this.prismaClient.user.findFirst({
      where: {
        username,
      },
    });

    return !!user;
  }

  public async findUserByUsernameEmail(usernameOrEmail: string) {
    const user = await this.prismaClient.user.findFirst({
      where: {
        OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      },
      include: {
        profile: true,
      },
    });

    return user;
  }
}
