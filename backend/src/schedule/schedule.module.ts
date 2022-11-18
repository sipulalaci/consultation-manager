import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ScheduleController } from './schedule.controller';

@Module({
  controllers: [ScheduleController],
  providers: [PrismaService],
})
export class ScheduleModule {}
