import { Module } from '@nestjs/common';
import { ApiModule } from '@src/apis/api.module';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { CoreModule } from '@src/core/core.module';
import { LibsModule } from '@src/libs/libs.module';

@Module({
  imports: [ApiModule, CoreModule, LibsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
