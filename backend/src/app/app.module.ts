import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { ProjectModule } from 'src/project/project.module';
import { PersonalProjectModule } from 'src/personal-project/personal-project.module';
import { ConsultationModule } from 'src/consultation/consultation.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { CommentModule } from 'src/comment/comment.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProjectModule,
    PersonalProjectModule,
    ConsultationModule,
    ScheduleModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
