import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Consultation, User } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConsultationBook(
    user1: User,
    user2: User,
    consultation: Consultation,
  ) {
    const url = `http://localhost:3000/personal-projects/${consultation.personalProjectId}`;

    await this.mailerService.sendMail({
      to: user1.email,
      subject: 'New consultation booked',
      template: './consultation',
      context: {
        name1: user1.name,
        name2: user2.name,
        date: consultation.date,
        time: consultation.date,
        url,
      },
    });
    await this.mailerService.sendMail({
      to: user2.email,
      subject: 'New consultation booked',
      template: './consultation',
      context: {
        name1: user2.name,
        name2: user1.name,
        date: format(new Date(consultation.date), 'yyyy-MM-dd'),
        time: format(new Date(consultation.date), 'HH:mm'),
        url,
      },
    });
  }

  async sendFailedDeadline(
    user: User,
    studentName: string,
    projectName: string,
    url: string,
  ) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Deadline not met',
      template: './failedDeadline',
      context: {
        name: user.name,
        projectName,
        studentName,
        url,
      },
    });
  }
}
