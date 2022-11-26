import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Consultation, User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(
    user1: User,
    user2: User,
    consultation: Consultation,
  ) {
    await this.mailerService.sendMail({
      to: user1.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'New consultation booked',
      template: './consultation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name1: user1.name,
        name2: user2.name,
        date: consultation.date,
        time: consultation.date,
      },
    });
    await this.mailerService.sendMail({
      to: user2.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'New consultation booked',
      template: './consultation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name1: user2.name,
        name2: user1.name,
        date: consultation.date,
        time: consultation.date,
      },
    });
  }
}
