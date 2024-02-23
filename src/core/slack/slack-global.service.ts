import { Injectable } from '@nestjs/common';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpProcessErrorException } from '@src/http-exceptions/exceptions/http-process-error.exception';
import axios from 'axios';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';

@Injectable()
export class SlackGlobalService {
  private readonly webhookUrl: string;

  constructor(
    private readonly appConfigService: AppConfigService
  ) {
    this.webhookUrl = this.appConfigService.get<string>(ENV_KEY.SERVER_ERROR_WEB_HOOK_URL);
  }

  async sendNotification({ statusCode, exceptionError, processError }: { statusCode: number, exceptionError?: HttpInternalServerErrorException, processError?: HttpProcessErrorException }): Promise<void> {
    console.log('this.webhookUrl: ', this.webhookUrl);
    
    let message = `[${process.env.NODE_ENV}-error || code: ${statusCode}]`;

    if (exceptionError) {
      const { errors, ctx, stack } = exceptionError;
      message += ` - ${ctx}`;
      if (errors) message += `\n${errors}`;
      if (stack) message += `\n${stack}`;
    }

    if (processError) {
      const { code } = processError;
      message += `${code ? `\nCode: ${code}` : ''}`;
    }

    try {
      await axios.post(this.webhookUrl, { text: message });
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      throw new Error('Failed to send Slack notification');
    }
  }
}
