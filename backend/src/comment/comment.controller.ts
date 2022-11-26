import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Protected } from '../auth/jwt.decorator';
import { uniq } from 'lodash';

@Controller('comments')
export class CommentController {
  constructor(private readonly prisma: PrismaService) {}

  @Protected()
  @Post()
  async createComment(@Body() newComment: any) {
    console.log('newComment', newComment);
    const comment = await this.prisma.comment.create({
      data: newComment,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return comment;
  }

  @Protected()
  @Put(':id')
  async updateComment(@Param('id') id: any, @Body() updatedComment: any) {
    const comment = await this.prisma.comment.update({
      where: { id },
      data: updatedComment,
    });
    return comment;
  }

  @Protected()
  @Get('user/:id')
  async getCommentsByUser(@Param('id') id: any) {
    const comments = await this.prisma.comment.findMany({
      where: { userId: id },
      include: {
        schedule: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!comments.length) {
      throw new NotFoundException('No comments found for this user');
    }

    const scheduleIds = uniq(comments.map((comment) => comment.schedule.id));

    const schedules = await this.prisma.schedule.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: { id: { in: scheduleIds } },
      include: {
        comments: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return schedules;
  }
}
