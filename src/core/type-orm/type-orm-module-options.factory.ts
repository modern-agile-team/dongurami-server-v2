import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';

@Injectable()
export class TypeOrmModuleOptionsFactory implements TypeOrmOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.appConfigService.get<string>(ENV_KEY.RDB_HOST),
      port: this.appConfigService.get<number>(ENV_KEY.RDB_PORT),
      username: this.appConfigService.get<string>(ENV_KEY.RDB_USER_NAME),
      password: this.appConfigService.get<string>(ENV_KEY.RDB_PASSWORD),
      database: this.appConfigService.get<string>(ENV_KEY.RDB_DATABASE),
      entities: ['dist/**/entities/*{.ts,.js}'],
      subscribers: ['dist/**/entities/subscribers/*{.ts,.js}'],
      logging: true,
      timezone: '+00:00',
    };
  }
}
