import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Controller('personal-projects')
export class PersonalProjectController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async createPersonalProject(@Body() newPersonalProject: any) {
    console.log('newPersonalProject', newPersonalProject);
    const personalProject = await this.prisma.personalProject.create({
      data: {
        ...newPersonalProject,
        status: 'PENDING',
      },
    });
    return personalProject;
  }

  @Get(':id')
  async getPersonalProject(@Param('id') id: string) {
    const personalProject = await this.prisma.personalProject.findUnique({
      where: { id },
      include: {
        schedules: {
          include: {
            comments: true,
          },
        },
      },
    });
    return personalProject;
  }

  @Get()
  async getPersonalProjects() {
    return this.prisma.personalProject.findMany();
  }

  @Put(':id')
  async updatePersonalProject(
    @Param('id') id: any,
    @Body() updatedPersonalProject: any,
  ) {
    const personalProject = await this.prisma.personalProject.update({
      where: { id },
      data: updatedPersonalProject,
    });

    return personalProject;
  }
}
