import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { PersonalProjectStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Protected } from '../auth/jwt.decorator';
import { MailService } from '../mail/mail.service';

@Controller('consultations')
export class ConsultationController {
  constructor(
    private readonly prisma: PrismaService,
    private mailService: MailService,
  ) {}

  @Protected()
  @Post()
  async createConsultation(
    @Body() newConsultation: { teacherId: string; date: Date },
  ) {
    const { teacherId, ...rest } = newConsultation;

    const consultation = await this.prisma.consultation.create({
      data: {
        ...rest,
        participants: {
          connect: {
            id: teacherId,
          },
        },
      },
    });
    return consultation;
  }

  @Protected()
  @Get(':id')
  async getConsultation(@Param('id') id: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
    });
    return consultation;
  }

  @Protected()
  @Get('student/:id')
  async getConsultations() {
    const personalProject = await this.prisma.personalProject.findMany({
      where: {
        status: PersonalProjectStatus.APPROVED,
      },
      include: {
        project: {
          include: {
            teacher: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    if (!personalProject || personalProject.length === 0) {
      throw new NotFoundException('There are no available consultations');
    }

    return this.prisma.consultation.findMany({
      orderBy: {
        date: 'asc',
      },
      where: {
        date: {
          gte: new Date(),
        },
        personalProjectId: null,
        participants: {
          some: {
            id: personalProject[0].project.teacher.id,
          },
        },
      },
    });
  }

  @Protected()
  @Get('teacher/:id')
  async getConsultationsByTeacher(@Param('id') id: any) {
    return this.prisma.consultation.findMany({
      where: {
        date: {
          gte: new Date(),
        },
        participants: {
          some: {
            id,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        personalProject: true,
      },
    });
  }

  @Protected()
  @Put(':id')
  async updateConsultation(
    @Param('id') id: any,
    @Body() updatedConsultation: any,
  ) {
    const { personalProjectId, studentId } = updatedConsultation;

    const consultation = await this.prisma.consultation.update({
      where: { id },
      include: {
        participants: true,
      },
      data: {
        personalProjectId,
        participants: {
          connect: {
            id: studentId,
          },
        },
      },
    });
    if (consultation.personalProjectId) {
      await this.mailService.sendConsultationBook(
        consultation.participants[0],
        consultation.participants[1],
        consultation,
      );
    }

    return consultation;
  }
}
