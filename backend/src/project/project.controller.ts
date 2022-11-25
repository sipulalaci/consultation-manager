import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PersonalProjectStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(@Body() newProject: any) {
    const project = await this.prisma.project.create({ data: newProject });
    return project;
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    return project;
  }

  @Get()
  async getProjects() {
    const projects = await this.prisma.project.findMany({
      include: {
        personalProjects: {
          where: {
            status:
              PersonalProjectStatus.PENDING ||
              PersonalProjectStatus.APPROVED ||
              PersonalProjectStatus.FAILED ||
              PersonalProjectStatus.DONE,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return projects.map((project) => {
      const { personalProjects, ...projectWithoutPersonalProjects } = project;
      return {
        ...projectWithoutPersonalProjects,
        personalProjectsCount: personalProjects.length,
      };
    });
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
      where: { id },
    });
  }
}
