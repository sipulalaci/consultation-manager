import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        secure: false,
        auth: {
          user: 'consultaion.manager.test@gmail.com',
          pass: 'mddlhfyvrfpbozyg',
        },
      },
      defaults: {
        from: '"No Reply" <noreply.consultaion.manager.test@gmail.com>',
      },
      template: {
        dir: join(__dirname, './templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
