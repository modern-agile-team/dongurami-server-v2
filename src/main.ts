import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpBadRequestExceptionFilter } from '@src/http-exceptions/filters/http-bad-request-exception.filter';
import { HttpForbiddenExceptionFilter } from '@src/http-exceptions/filters/http-forbidden-exception.filter';
import { HttpInternalServerErrorExceptionFilter } from '@src/http-exceptions/filters/http-internal-server-error-exception.filter';
import { HttpNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-not-found-exception.filter';
import { HttpPathNotFoundExceptionFilter } from '@src/http-exceptions/filters/http-path-not-found-exception.filter';
import { HttpProcessErrorExceptionFilter } from '@src/http-exceptions/filters/http-process-error-exception.filter';
import { HttpRemainderExceptionFilter } from '@src/http-exceptions/filters/http-remainder-exception.filter';
import { HttpUnauthorizedExceptionFilter } from '@src/http-exceptions/filters/http-unauthorized-exception.filter';
import { SuccessInterceptor } from '@src/interceptors/success-interceptor/success.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  const appConfigService = app.get<AppConfigService>(AppConfigService);
  const PORT = appConfigService.get<number>(ENV_KEY.PORT);
  const isProduction = appConfigService.isProduction();

  app.enableCors();
  app.useLogger(logger);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    app.get<SuccessInterceptor>(SuccessInterceptor),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  if (!isProduction) {
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

    const document = SwaggerModule.createDocument(app, config, {});

    SwaggerModule.setup('api-docs', app, document, {
      jsonDocumentUrl: JSON_PATH,
      yamlDocumentUrl: YAML_PATH,
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  app.useGlobalFilters(
    app.get(HttpProcessErrorExceptionFilter),
    app.get(HttpRemainderExceptionFilter),
    app.get(HttpInternalServerErrorExceptionFilter),
    app.get(HttpConflictException),
    app.get(HttpNotFoundExceptionFilter),
    app.get(HttpPathNotFoundExceptionFilter),
    app.get(HttpForbiddenExceptionFilter),
    app.get(HttpUnauthorizedExceptionFilter),
    app.get(HttpBadRequestExceptionFilter),
  );

  await app.listen(PORT);
}
bootstrap();
