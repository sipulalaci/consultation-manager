import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectController } from './project.controller';

@Module({
  controllers: [ProjectController],
  providers: [PrismaService],
})
export class ProjectModule {}
