import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Protected } from '../auth/jwt.decorator';

@Controller('consultations')
export class ConsultationController {
  constructor(private readonly prisma: PrismaService) {}

  @Protected()
  @Post()
  async createConsultation(@Body() newConsultation: any) {
    console.log('newConsultation', newConsultation);
    const consultation = await this.prisma.consultation.create({
      data: newConsultation,
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
  @Get()
  async getConsultations() {
    return this.prisma.consultation.findMany();
  }

  @Protected()
  @Put(':id')
  async updateConsultation(
    @Param('id') id: any,
    @Body() updatedConsultation: any,
  ) {
    const consultation = await this.prisma.consultation.update({
      where: { id },
      data: updatedConsultation,
    });

    return consultation;
  }
}
