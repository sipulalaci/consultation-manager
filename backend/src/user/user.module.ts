import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserController } from './user.controller';

@Module({
  providers: [PrismaService],
  controllers: [UserController],
})
export class UserModule {}
