import { User } from "@prisma/client";
import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  Put,
} from "routing-controllers";
import LoginDto from "../../types/domain/auth/LoginDto";
import RegisterDto from "../../types/domain/auth/RegisterDto";
import UserService from "../user/UserService";
import AuthService from "./AuthService";
import { PasswordResetPostDto } from "./types/PasswordResetPostDto";

@JsonController()
export class AuthController {
  constructor(
    private userService = new UserService(),
    private authService = new AuthService()
  ) {}

  @Get("/me/lastOpenedGroupId")
  findMyLastOpenedGroupId(@CurrentUser({ required: true }) user: User) {
    return this.userService.findLastOpenedGroupId(user.id);
  }

  @Put("/me/lastOpenedGroupId")
  async updateMyLastOpenedGroupId(
    @CurrentUser({ required: true }) user: User,
    @Body({ required: true }) body: { groupId: string }
  ) {
    const result = await this.userService.updateLastOpenedGroupId(
      user.id,
      body.groupId
    );
    return result;
  }

  @Get("/auth/me")
  async getMe(@CurrentUser({ required: true }) user: User) {
    return this.authService.getAuthUserWithToken(user);
  }

  @Post("/auth/register")
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post("/auth/login")
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post("/auth/password-reset")
  async resetPassword(@Body() body: PasswordResetPostDto) {
    return this.authService.resetPassword(body);
  }
}
