import { DynamicModule, Module } from '@nestjs/common';
import { REACTION_REPOSITORY_TOKEN } from '@src/apis/reactions/constants/reaction.token';
import { ReactionTypeRepository } from '@src/apis/reactions/repositories/reaction-type.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { ReactionsService } from './services/reactions.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ReactionTypeRepository])],
  providers: [ReactionsService],
  exports: [ReactionsService],
})
export class ReactionsModule {
  static forFeature(reactionRepository: any): DynamicModule {
    return {
      module: ReactionsModule,
      providers: [
        {
          provide: REACTION_REPOSITORY_TOKEN,
          useValue: reactionRepository,
        },
      ],
    };
  }
}
