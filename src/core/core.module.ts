import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AppConfigModule } from '@src/core/app-config/app-config.module';
import { TypeOrmModuleOptionsFactory } from '@src/core/type-orm/type-orm-module-options.factory';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmModuleOptionsFactory,
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
  providers: [TypeOrmModuleOptionsFactory],
})
export class CoreModule {}
