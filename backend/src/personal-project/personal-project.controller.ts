import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PersonalProjectStatus } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaService } from 'prisma/prisma.service';
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
  async createPersonalProject(
    @Body() newPersonalProject: { studentId: string; projectId: string },
  ) {
    const activePersonalProjects = await this.prisma.personalProject.findMany({
      where: {
        studentId: newPersonalProject.studentId,
        OR: [
          { status: PersonalProjectStatus.APPROVED },
          { status: PersonalProjectStatus.PENDING },
        ],
      },
    });

    if (activePersonalProjects.length > 0) {
      throw new BadRequestException(
        'Student already has an active personal project',
      );
    }
    const personalProject = await this.prisma.personalProject.create({
      data: {
        ...newPersonalProject,
        status: PersonalProjectStatus.PENDING,
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
            tasks: {
              orderBy: {
                createdAt: 'asc',
              },
            },
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
        consultations: {
          orderBy: {
            date: 'asc',
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
      orderBy: {
        createdAt: 'desc',
      },
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
    const personalProjectInDb = await this.prisma.personalProject.findUnique({
      where: { id },
    });

    if (!personalProjectInDb) {
      throw new NotFoundException(`Personal Project with id ${id} not found`);
    }

    if (
      updatedPersonalProject.status &&
      updatedPersonalProject.status !== personalProjectInDb.status &&
      [PersonalProjectStatus.APPROVED, PersonalProjectStatus.PENDING].includes(
        updatedPersonalProject.status,
      )
    ) {
      const activePersonalProjects = await this.prisma.personalProject.findMany(
        {
          where: {
            studentId: personalProjectInDb.studentId,
            OR: [
              { status: PersonalProjectStatus.APPROVED },
              { status: PersonalProjectStatus.PENDING },
            ],
          },
        },
      );

      if (
        activePersonalProjects.length > 1 ||
        (activePersonalProjects.length === 1 &&
          activePersonalProjects[0].id !== personalProjectInDb.id)
      ) {
        throw new BadRequestException(
          'Student already has an active personal project',
        );
      }
    }

    const personalProject = await this.prisma.personalProject.update({
      where: { id },
      data: updatedPersonalProject,
    });

    return personalProject;
  }
}
