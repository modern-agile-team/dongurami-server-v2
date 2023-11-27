import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '@src/core/app-config/app-config.module';
import { TypeOrmModuleOptionsFactory } from '@src/core/type-orm/type-orm-module-options.factory';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmModuleOptionsFactory,
    }),
  ],
  providers: [TypeOrmModuleOptionsFactory],
})
export class CoreModule {}
