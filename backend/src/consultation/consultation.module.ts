import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ConsultationController } from './consultation.controller';

@Module({
  controllers: [ConsultationController],
  providers: [PrismaService],
})
export class ConsultationModule {}
