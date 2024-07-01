import { MailerService } from '@nestjs-modules/mailer';
import { MailPayload } from './mail.dto';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    accountActivationMail(user: MailPayload): Promise<any>;
}
