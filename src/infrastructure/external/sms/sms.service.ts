import { Injectable, Logger } from '@nestjs/common';
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  async sendOtp(phone: string, code: string): Promise<void> {
    // Replace this adapter with the contracted Vietnamese SMS vendor in production.
    this.logger.log(`Development OTP for ${phone}: ${code}`);
  }
}
