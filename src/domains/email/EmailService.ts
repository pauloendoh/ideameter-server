import { MailService } from "@sendgrid/mail";

export class EmailService {
  constructor(private sendgridService = new MailService()) {
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
}
