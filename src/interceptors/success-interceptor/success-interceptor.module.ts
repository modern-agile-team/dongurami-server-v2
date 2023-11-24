import { Module } from '@nestjs/common';

@Module({
  providers: [SuccessInterceptorModule],
})
export class SuccessInterceptorModule {}
