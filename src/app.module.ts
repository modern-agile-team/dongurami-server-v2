import { Module } from '@nestjs/common';
import { ApiModule } from '@src/apis/api.module';
import { CoreModule } from '@src/core/core.module';
import { LibsModule } from '@src/libs/libs.module';

@Module({
  imports: [ApiModule, CoreModule, LibsModule],
})
export class AppModule {}
