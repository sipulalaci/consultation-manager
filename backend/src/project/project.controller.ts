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
import { Protected } from '../auth/jwt.decorator';

@Controller('projects')
export class ProjectController {
  constructor(private readonly prisma: PrismaService) {}

  @Protected()
  @Post()
  async createProject(@Body() newProject: any) {
    const project = await this.prisma.project.create({ data: newProject });
    return project;
  }

  @Protected()
  @Get(':id')
  async getProject(@Param('id') id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    return project;
  }

  @Protected()
  @Get()
  async getProjects() {
    const projects = await this.prisma.project.findMany({
      include: {
        personalProjects: {
          where: {
            OR: [
              { status: PersonalProjectStatus.PENDING },
              { status: PersonalProjectStatus.APPROVED },
              { status: PersonalProjectStatus.FAILED },
              { status: PersonalProjectStatus.DONE },
            ],
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

  @Protected()
  @Put(':id')
  async updateProject(@Param('id') id: any, @Body() updatedProject: any) {
    const project = await this.prisma.project.update({
      where: { id },
      data: updatedProject,
    });

    return project;
  }

  @Protected()
  @Delete(':id')
  async deleteProject(@Param(':id') id: any) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
