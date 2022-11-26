import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { ConsultationController } from './consultation.controller';

@Module({
  imports: [MailModule],
  controllers: [ConsultationController],
  providers: [PrismaService],
})
export class ConsultationModule {}
