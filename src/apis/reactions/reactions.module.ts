import { DynamicModule, Module, Type } from '@nestjs/common';
import { REACTION_REPOSITORY_TOKEN } from '@src/apis/reactions/constants/reaction.token';
import { ReactionTypeRepository } from '@src/apis/reactions/repositories/reaction-type.repository';
import { RequiredReactionColumn } from '@src/apis/reactions/types/reaction.type';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { DataSource } from 'typeorm';
import { ReactionsService } from './services/reactions.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ReactionTypeRepository])],
  providers: [ReactionsService],
  exports: [ReactionsService],
})
export class ReactionsModule {
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
