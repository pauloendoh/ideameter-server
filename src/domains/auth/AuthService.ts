import { User } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { HttpError } from "routing-controllers";
import { AuthUserGetDto } from "../../types/domain/auth/AuthUserGetDto";
import LoginDto from "../../types/domain/auth/LoginDto";
import RegisterDto, {
  getInvalidRegisterPayloadMessage,
} from "../../types/domain/auth/RegisterDto";
import { InvalidPayloadError400 } from "../../utils/errors/InvalidPayloadError400";
import NotFoundError404 from "../../utils/errors/NotFoundError404";
import { EmailService } from "../email/EmailService";
import { ProfileRepository } from "../profile/ProfileRepository";
import AuthRepository from "./AuthRepository";

export default class AuthService {
  constructor(
    private readonly authRepo = new AuthRepository(),
    private readonly profileRepository = new ProfileRepository(),
    private emailService = new EmailService()
  ) {}

  public async register(data: RegisterDto) {
    const invalidPayloadMessage = getInvalidRegisterPayloadMessage(data);
    if (invalidPayloadMessage)
      throw new InvalidPayloadError400(invalidPayloadMessage);

    const emailExists = await this.authRepo.emailExists(data.email);
    if (emailExists) throw new HttpError(409, "Email already exists");

    const usernameExists = await this.authRepo.usernameExists(data.username);
    if (usernameExists) throw new HttpError(409, "Username already exists");

    const salt = await genSalt(10);
    const newUser = await this.authRepo.registerNewUser(
      data.email,
      data.username,
      await hash(data.password1, salt)
    );

    const { token, expiresAt } = this.getSignInToken(newUser);

    this.emailService.notifyNewUserToDevs(newUser.username);

    return new AuthUserGetDto(newUser, newUser.profile, token, expiresAt);
  }

  public async login(payload: LoginDto) {
    const user = await this.authRepo.findUserByUsernameEmail(
      payload.identificator
    );
    if (!user) throw new NotFoundError404("User not found");

    const passwordOk = await compare(payload.password, user.password);
    if (!passwordOk) throw new InvalidPayloadError400("Password not correct");

    const { token, expiresAt } = this.getSignInToken(user);
    return new AuthUserGetDto(user, user.profile, token, expiresAt);
  }

  private getSignInToken(user: User) {
    const expiresAt = new Date(new Date().setDate(new Date().getDate() + 365));
    const ONE_YEAR_IN_SECONDS = 3600 * 24 * 365;

    const token = sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: ONE_YEAR_IN_SECONDS,
    });
    return { token, expiresAt };
  }

  public async getAuthUserWithToken(user: User) {
    const { token, expiresAt } = this.getSignInToken(user);
    const profile = await this.profileRepository.findProfileByUserId(user.id);
    return new AuthUserGetDto(user, profile, token, expiresAt);
  }
}
