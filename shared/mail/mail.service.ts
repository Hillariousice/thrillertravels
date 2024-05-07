import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailPayload } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async accountActivationMail(user: MailPayload): Promise<any> {
    const { firstName, token, email } = user;
    const year = new Date();
    try {
      return await this.mailerService.sendMail({
        to: email,
        subject: 'Account Activation',
        template: 'activation',
        context: {
          token,
          name: `${firstName}`,
          year: year.getFullYear(),
          url: `${process.env.FRONTEND_DOMAIN}/auth/verify`,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Unable to send mail, please contact the admin',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
