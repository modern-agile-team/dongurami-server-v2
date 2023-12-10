import { Inject, Injectable } from '@nestjs/common';
import { ReactionName } from '@src/apis/reactions/constants/reaction.enum';
import { REACTION_REPOSITORY_TOKEN } from '@src/apis/reactions/constants/reaction.token';
import { ReactionTypeRepository } from '@src/apis/reactions/repositories/reaction-type.repository';
import { RequiredReactionColumn } from '@src/apis/reactions/types/reaction.type';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { REACTION_ERROR_CODE } from '@src/constants/error/raction/raction-error-code.constant';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ReactionsService<E extends RequiredReactionColumn> {
  constructor(
    @Inject(REACTION_REPOSITORY_TOKEN)
    private readonly reactionRepository: Repository<E>,
    private readonly reactionTypeRepository: ReactionTypeRepository,
  ) {}

  async create(reactionName: ReactionName, userId: number, parentId: number) {
    const reactionType = await this.reactionTypeRepository.findOne({
      select: {
        id: true,
      },
      where: {
        name: reactionName,
      },
    });

    if (!reactionType) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: 'reaction 중 reaction type 이 존재하지 않음',
      });
    }

    const reactionTypeId = reactionType.id;

    const existReaction = await this.reactionRepository.findOne({
      where: {
        reactionTypeId,
        userId,
        parentId,
      } as FindOptionsWhere<E>,
    });

    if (existReaction) {
      throw new HttpConflictException({
        code: REACTION_ERROR_CODE.ALREADY_LIKED,
      });
    }

    await this.reactionRepository.save(
      {
        reactionTypeId,
        userId,
        parentId,
      } as DeepPartial<E>,
      { reload: false },
    );
  }
}
