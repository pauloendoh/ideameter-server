import { Body, JsonController, Post } from "routing-controllers";
import { EmailService } from "../email/EmailService";

@JsonController("/utils")
export class UtilsController {
  constructor(private emailService = new EmailService()) {}
  @Post("/password-reset-email")
  searchUsers(@Body({ required: true }) body: { email: string }) {
    return this.emailService.sendPasswordResetEmail(body.email);
  }
}
