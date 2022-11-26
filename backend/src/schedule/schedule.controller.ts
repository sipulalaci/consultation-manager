import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Protected } from '../auth/jwt.decorator';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly prisma: PrismaService) {}

  @Protected()
  @Post()
  async createSchedule(@Body() newSchedule: any) {
    const schedule = await this.prisma.schedule.create({
      data: newSchedule,
      include: {
        tasks: true,
      },
    });
    return schedule;
  }

  @Protected()
  @Put(':id')
  async updateSchedule(@Param('id') id: any, @Body() updatedSchedule: any) {
    const schedule = await this.prisma.schedule.update({
      where: { id },
      data: updatedSchedule,
    });

    return schedule;
  }

  @Protected()
  @Post(':id/add-task')
  async addTaskToSchedule(
    @Param('id') id: string,
    @Body() newTask: { description: string },
  ) {
    const schedule = await this.prisma.task.create({
      data: { ...newTask, scheduleId: id, isDone: false },
    });

    return schedule;
  }

  @Protected()
  @Put(':id/toggle-task/:taskId')
  async updateTask(@Param('id') id: string, @Param('taskId') taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException('Task not found id: ' + taskId);
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { isDone: !task.isDone },
    });

    return updatedTask;
  }
}
