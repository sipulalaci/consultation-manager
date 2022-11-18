import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PersonalProjectController } from './personal-project.controller';

@Module({
  controllers: [PersonalProjectController],
  providers: [PrismaService],
})
export class PersonalProjectModule {}
