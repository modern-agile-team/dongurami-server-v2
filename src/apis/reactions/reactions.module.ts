import { DynamicModule, Module, Type } from '@nestjs/common';
import { REACTION_REPOSITORY_TOKEN } from '@src/apis/reactions/constants/reaction.token';
import { ReactionTypeRepository } from '@src/apis/reactions/repositories/reaction-type.repository';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { RequiredReactionColumn } from '@src/apis/reactions/types/reaction.type';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ReactionTypeRepository])],
  providers: [ReactionsService],
  exports: [ReactionsService],
})
export class ReactionsModule {
  /**
   * @requires 해당 module을 사용하려면 entity에 userId, parentId, reactionTypeId가 선언돼야합니다.
   */
  static forFeature(
    reactionEntity: Type<RequiredReactionColumn>,
  ): DynamicModule {
    return {
      module: ReactionsModule,
      providers: [
        {
          provide: REACTION_REPOSITORY_TOKEN,
          useFactory: (dataSource: DataSource) => {
            return dataSource.getRepository(reactionEntity);
          },
          inject: [DataSource],
        },
      ],
    };
  }
}
