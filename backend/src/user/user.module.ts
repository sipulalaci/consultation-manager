import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { jwtConstants } from '../auth/constants';
import { UserController } from './user.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [PrismaService],
  controllers: [UserController],
})
export class UserModule {}
