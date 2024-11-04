import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from 'src/config';


@Injectable()
export class EmailService {
  private readonly logger = new Logger('EmailService');
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: envs.gmailEmail,
        pass: envs.gmailPassword,
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    const mailOptions = {
      from: envs.gmailEmail,
      to: email,
      subject: 'Welcome to our service',
      text: `Hello ${name}, welcome CONSOLE LEARN.`,
      html: `<p>Hello ${name},</p><p>Welcome to our course platform! We hope you find the course that suits you best and enjoy a great learning experience!</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${email}: ${error.message}`);
    }
  }

  async coursePurchased(email: string, name: string, courseName: string) {
    const mailOptions = {
      from: envs.gmailEmail,
      to: email,
      subject: `Thank you for purchasing the course: ${courseName}`,
      text: `Hello ${name}, thank you for purchasing the course "${courseName}". We hope you enjoy it!`,
      html: `<p>Hello ${name},</p><p>Thank you for purchasing the course "<strong>${courseName}</strong>". We hope you enjoy it and have a valuable learning experience!</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Course purchase email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${email}: ${error.message}`);
    }
  }
}
