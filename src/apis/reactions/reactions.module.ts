import { DynamicModule, Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { REACTION_REPOSITORY_TOKEN } from '@src/apis/reactions/constants/reaction.token';
import { ReactionTypeRepository } from '@src/apis/reactions/repositories/reaction-type.repository';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { RequiredReactionColumn } from '@src/apis/reactions/types/reaction.type';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ReactionTypeRepository])],
})
export class ReactionsModule {
  /**
   * @requires 해당 module을 사용하려면 entity에 userId, parentId, reactionTypeId가 선언돼야합니다.
   */
  static forFeature(
    ReactionEntity: Type<RequiredReactionColumn>,
  ): DynamicModule {
    return {
      module: ReactionsModule,
      imports: [TypeOrmModule.forFeature([ReactionEntity])],
      providers: [
        ReactionsService,
        {
          provide: REACTION_REPOSITORY_TOKEN,
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(ReactionEntity);
          },
          inject: [DataSource],
        },
      ],
      exports: [ReactionsService],
    };
  }
}
