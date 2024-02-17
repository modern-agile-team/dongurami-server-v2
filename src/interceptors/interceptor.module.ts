import { Module } from '@nestjs/common';

import { SuccessInterceptorModule } from '@src/interceptors/success-interceptor/success-interceptor.module';

@Module({
  imports: [SuccessInterceptorModule],
  exports: [SuccessInterceptorModule],
})
export class InterceptorModule {}
