import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Protected } from '../auth/jwt.decorator';
import { jwtDecoder } from '../utils/jwtDecoder';

@Controller('personal-projects')
export class PersonalProjectController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @Protected()
  @Post()
  async createPersonalProject(@Body() newPersonalProject: any) {
    const personalProject = await this.prisma.personalProject.create({
      data: {
        ...newPersonalProject,
        status: 'PENDING',
      },
    });
    return personalProject;
  }

  @Protected()
  @Get(':id')
  async getPersonalProject(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const userId = await jwtDecoder(authorization, this.jwtService);

    const personalProject = await this.prisma.personalProject.findUnique({
      where: { id },
      include: {
        schedules: {
          include: {
            tasks: true,
            comments: {
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
        },
        project: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (
      !personalProject ||
      !(
        personalProject &&
        (personalProject.studentId === userId ||
          personalProject.project.teacherId === userId)
      )
    ) {
      throw new NotFoundError(`Personal Project with id ${id} not found`);
    }
    return personalProject;
  }

  @Protected()
  @Get()
  async getPersonalProjects(@Headers('Authorization') authorization: string) {
    const userId = await jwtDecoder(authorization, this.jwtService);

    return this.prisma.personalProject.findMany({
      where: {
        OR: [
          { studentId: userId },
          {
            project: {
              teacherId: userId,
            },
          },
        ],
      },
      include: {
        student: {
          select: {
            name: true,
          },
        },
        project: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  @Protected()
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
