import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { jwtConstants } from '../auth/constants';
import { MailModule } from '../mail/mail.module';
import { PersonalProjectController } from './personal-project.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    MailModule,
  ],
  controllers: [PersonalProjectController],
  providers: [PrismaService],
})
export class PersonalProjectModule {}
