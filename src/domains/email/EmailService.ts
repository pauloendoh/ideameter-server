import { MailService } from "@sendgrid/mail";
import { isValidEmail } from "../../utils/email/isValidEmail";
import { InvalidPayloadError400 } from "../../utils/errors/InvalidPayloadError400";
import { UserTokenRepository } from "../user-token/UserTokenRepository";
import UserRepository from "../user/UserRepository";

export class EmailService {
  constructor(
    private sendgridService = new MailService(),
    private userRepo = new UserRepository(),
    private tokenRepo = new UserTokenRepository()
  ) {
    this.sendgridService.setApiKey(process.env.SENDGRID_API_KEY);
  }

  notifyNewUserToDevs(username: string) {
    const devsEmailsString = process.env.NOTIFY_NEW_USER_TO_DEVS;

    if (!devsEmailsString?.trim()) return;

    const devsEmails = devsEmailsString.split(";").map((s) => s.trim());

    this.sendgridService
      .send({
        to: devsEmails,
        from: "endohpa@gmail.com",
        subject: "New user in ideameter - " + username,
        text: "congrats to us :)",
      })
      .then(() => {
        console.log("Email sent!");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  async sendPasswordResetEmail(email: string) {
    if (!isValidEmail(email))
      throw new InvalidPayloadError400("Invalid email.");

    const registeredUser = await this.userRepo.findByEmail(email);
    if (!registeredUser) return true;

    await this.tokenRepo.deleteAllPasswordResetTokens(registeredUser.id);

    const token = await this.tokenRepo.createPasswordResetToken(
      registeredUser.id
    );

    const url =
      process.env.CLIENT_BASE_URL +
      "/password-reset?token=" +
      token.token +
      "&userId=" +
      registeredUser.id;

    this.sendgridService
      .send({
        from: "endohpa@gmail.com",
        to: registeredUser.email,
        subject: "Ideameter - Password reset", // Subject line
        text: "Enter this link to complete your password reset: ",
        html: `Enter this link to complete your password reset: <br/>
            <a href="${url}">${url}</a>
        `,
      })
      .then(() => {
        console.log("Email sent!");
      })
      .catch((error) => {
        console.log(error.message);
      });

    return true;
  }
}
