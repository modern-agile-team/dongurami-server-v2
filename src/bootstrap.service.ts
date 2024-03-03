import {
  ClassSerializerInterceptor,
  INestApplication,
  Injectable,
  Logger,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { singularize } from 'inflection';

import { CustomValidationPipe } from '@src/pipes/custom-validation.pipe';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpBadRequestExceptionFilter } from '@src/http-exceptions/filters/http-bad-request-exception.filter';
import { HttpConflictExceptionFilter } from '@src/http-exceptions/filters/http-conflict-exception.filter';
import { HttpForbiddenExceptionFilter } from '@src/http-exceptions/filters/http-forbidden-exception.filter';
import { HttpInternalServerErrorExceptionFilter } from '@src/http-exceptions/filters/http-internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-not-found-exception.filter';
import { HttpPathNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-path-not-found-exception.filter';
import { HttpProcessErrorExceptionFilter } from '@src/http-exceptions/filters/http-process-error-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/http-exceptions/filters/http-remainder-exception.filter';
import { HttpUnauthorizedExceptionFilter } from '@src/http-exceptions/filters/http-unauthorized-exception.filter';
import { SuccessInterceptor } from '@src/interceptors/success-interceptor/success.interceptor';

@Injectable()
export class BootstrapService {
  setCors(app: INestApplication) {
    app.enableCors();
  }

  setLogger(app: INestApplication) {
    const logger = new Logger();

    app.useLogger(logger);
  }

  setPathPrefix(app: INestApplication) {
    app.setGlobalPrefix('api');
  }

  setInterceptor(app: INestApplication) {
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
      app.get<SuccessInterceptor>(SuccessInterceptor),
    );
  }

  setPipe(app: INestApplication) {
    const options: Omit<ValidationPipeOptions, 'exceptionFactory'> = {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    };

    const exceptionFactory = (validationErrors: ValidationError[]) => {
      throw new HttpBadRequestException({
        code: COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
        errors: validationErrors.flatMap((validationError) => {
          return {
            property: validationError.property,
            value: validationError.value,
            reason: Object.values(validationError.constraints)[0] || '',
          };
        }),
      });
    };

    app.useGlobalPipes(
      new CustomValidationPipe({
        ...options,
        exceptionFactory,
      }),
    );
  }

  setFilter(app: INestApplication) {
    app.useGlobalFilters(
      app.get(HttpProcessErrorExceptionFilter),
      app.get(HttpRemainderExceptionFilter),
      app.get(HttpInternalServerErrorExceptionFilter),
      app.get(HttpConflictExceptionFilter),
      app.get(HttpNotFoundExceptionFilter),
      app.get(HttpPathNotFoundExceptionFilter),
      app.get(HttpForbiddenExceptionFilter),
      app.get(HttpUnauthorizedExceptionFilter),
      app.get(HttpBadRequestExceptionFilter),
    );
  }

  setSwagger(app: INestApplication) {
    const appConfigService = app.get<AppConfigService>(AppConfigService);

    if (appConfigService.isProduction()) {
      return;
    }

    const DOMAIN = appConfigService.get<string>(ENV_KEY.DOMAIN);
    const JSON_PATH = 'api-docs-json';
    const YAML_PATH = 'api-docs-yaml';

    const config = new DocumentBuilder()
      .setTitle('dongurami v2')
      .setDescription(
        'dongurami v2 api</br>' +
          `<a target="_black" href="${DOMAIN}/${JSON_PATH}">json document</a></br>` +
          `<a target="_black" href="${DOMAIN}/${YAML_PATH}">yaml document</a></br>`,
      )
      .setVersion('0.1')
      .addBearerAuth()
      .build();

    /**
     * @todo 수정될 수 있음.
     * ex) controller - Controller 지우고 단수형으로 변경
     * method name은 그대로
     * 문제점 - 메서드 네이밍 규칙이 각자 스타일이 달라서 모든 케이스에 대응할 수 없음.
     * 메서드명, 컨트롤러 명에 같은 단어가 들어있는게 문제가 될 수 있다.
     * rest 형식으로 가져갔을때 메서드 명을 제어할 수 있는 방법이 있다.
     * [interface]{@link https://github.com/rrgks6221/nestjs-boiler-plate/blob/main/src/apis/posts/controllers/posts.controller.ts}
     * [implements controller]{@link https://github.com/rrgks6221/nestjs-boiler-plate/blob/main/src/apis/posts/controllers/posts.controller.ts}
     */
    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) => {
        const controllerName = singularize(
          controllerKey.replace(/Controller$/, ''),
        ).replace(/^(.)*/, (matchStr) => matchStr.toLowerCase());

        return `${controllerName}_${methodKey}`;
      },
    });

    SwaggerModule.setup('api-docs', app, document, {
      jsonDocumentUrl: JSON_PATH,
      yamlDocumentUrl: YAML_PATH,
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: (a: Map<any, any>, b: Map<any, any>) => {
          const order = {
            post: '0',
            get: '1',
            put: '2',
            patch: '3',
            delete: '4',
          };

          return order[a.get('method')].localeCompare(order[b.get('method')]);
        },
      },
    });
  }

  async startingServer(app: INestApplication) {
    const appConfigService = app.get<AppConfigService>(AppConfigService);

    const PORT = appConfigService.get<number>(ENV_KEY.PORT);

    await app.listen(PORT);

    console.info(`Server listening on port ${PORT}`);
  }
}
