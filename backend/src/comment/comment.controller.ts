import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Protected } from '../auth/jwt.decorator';

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
}
