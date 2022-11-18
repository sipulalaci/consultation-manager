import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async createSchedule(@Body() newSchedule: any) {
    console.log('newSchedule', newSchedule);
    const schedule = await this.prisma.schedule.create({
      data: newSchedule,
    });
    return schedule;
  }

  @Put(':id')
  async updateSchedule(@Param('id') id: any, @Body() updatedSchedule: any) {
    const schedule = await this.prisma.schedule.update({
      where: { id },
      data: updatedSchedule,
    });

    return schedule;
  }
}
