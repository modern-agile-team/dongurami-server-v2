import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

import { AppConfigService } from '@src/core/app-config/services/app-config.service';

/**
 * production 환경에서 api 를 없는 path 처럼 보이게 하는 middleware
 */
@Injectable()
export class UseDevelopmentMiddleware implements NestMiddleware {
  constructor(private readonly appConfigService: AppConfigService) {}

  use(request: Request, _response: Response, next: NextFunction) {
    const isProduction = this.appConfigService.isProduction();
    const { path, method } = request;

    if (isProduction) {
      throw new NotFoundException('Cannot' + ' ' + method + ' ' + path);
    }

    next();
  }
}
