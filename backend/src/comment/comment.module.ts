import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CommentController } from './comment.controller';

@Module({
  controllers: [CommentController],
  providers: [PrismaService],
})
export class CommentModule {}
