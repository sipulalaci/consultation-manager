import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async createProject(@Body() newProject: any) {
    console.log('newProject', newProject);
    const project = await this.prisma.project.create({ data: newProject });
    return project;
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    return project;
  }

  @Get()
  async getProjects(){
    return this.prisma.project.findMany();
  }

  @Put(':id')
  async updateProject(@Param('id') id: any, @Body() updatedProject: any) {
    const project = await this.prisma.project.update({
      where: { id },
      data: updatedProject,
    });

    return project;
  }

  @Delete(':id')
  async deleteProject(@Param(':id') id: any) {
    return this.prisma.project.delete({
        where: { id }
    });
  }
}