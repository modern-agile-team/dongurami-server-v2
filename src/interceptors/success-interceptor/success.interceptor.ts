import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PageDto } from '@src/dto/page.dto';
import { ResponseBuilder } from '@src/interceptors/success-interceptor/builders/success-response.builder';
import { SET_RESPONSE } from '@src/interceptors/success-interceptor/constants/success-interceptor.constant';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { Args } from '@src/interceptors/success-interceptor/types/success-interceptor.type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly responseBuilder: ResponseBuilder,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => {
        const args = this.reflector.get<Args | undefined>(
          SET_RESPONSE,
          context.getHandler(),
        );

        // args 가 없으면 해당 인터셉터를 사용하지 않는다고 판별한다.
        if (!args) return data;

        // delete 관련된 api response
        if (args.type === ResponseType.Delete) {
          return this.responseBuilder.delete({ data });
        }

        const { type, key } = args;

        // 공통적인 api 에 대한 response
        if (type === ResponseType.Common) {
          return this.responseBuilder.common({ data, key });
        }

        // 단일 action api 에 대한 response
        if (type === ResponseType.Detail) {
          return this.responseBuilder.detail({ data, key });
        }

        // pagination api response
        if (type === ResponseType.Pagination) {
          const request = context.switchToHttp().getRequest();
          const { query } = request;
          const { page, pageSize }: PageDto = query;

          return this.responseBuilder.pagination(
            { data, key },
            { page, pageSize },
          );
        }

        return data;
      }),
    );
  }
}
