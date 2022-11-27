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
    const subject = `New consultation booked`;
    const template = './consultation';
    const date = format(new Date(consultation.date), 'yyyy-MM-dd');
    const time = format(new Date(consultation.date), 'HH:mm');
    const url = `http://localhost:3000/personal-projects/${consultation.personalProjectId}`;

    await this.mailerService.sendMail({
      to: user1.email,
      subject,
      template,
      context: {
        name1: user1.name,
        name2: user2.name,
        date,
        time,
        url,
      },
    });
    await this.mailerService.sendMail({
      to: user2.email,
      subject,
      template,
      context: {
        name1: user2.name,
        date,
        time,
        url,
      },
    });
  }

  async sendFailedDeadline(
    teacher: User,
    student: User,
    projectName: string,
    url: string,
  ) {
    const subject = `Deadline not met`;

    await this.mailerService.sendMail({
      to: teacher.email,
      subject,
      template: './failedDeadlineTeacher',
      context: {
        name: teacher.name,
        projectName,
        studentName: student.name,
        url,
      },
    });
    await this.mailerService.sendMail({
      to: student.email,
      subject,
      template: './failedDeadlineStudent',
      context: {
        name: student.name,
        projectName,
        url,
      },
    });
  }
}
