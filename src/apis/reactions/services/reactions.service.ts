import { Inject, Injectable } from '@nestjs/common';

import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { ReactionType } from '@src/apis/reactions/constants/reaction.enum';
import { REACTION_REPOSITORY_TOKEN } from '@src/apis/reactions/constants/reaction.token';
import { ReactionTypeRepository } from '@src/apis/reactions/repositories/reaction-type.repository';
import { RequiredReactionColumn } from '@src/apis/reactions/types/reaction.type';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { REACTION_ERROR_CODE } from '@src/constants/error/reaction/reaction-error-code.constant';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';

/**
 * @requires 해당 service 를 사용하려면 entity에 userId, parentId, reactionTypeId가 선언돼야합니다.
 */
@Injectable()
export class ReactionsService<E extends RequiredReactionColumn> {
  constructor(
    @Inject(REACTION_REPOSITORY_TOKEN)
    private readonly reactionRepository: Repository<E>,
    private readonly reactionTypeRepository: ReactionTypeRepository,
  ) {}

  async create(type: ReactionType, userId: number, parentId: number) {
    const reactionType = await this.findOneReactionTypeOrFail(type);
    const reactionTypeId = reactionType.id;

    const isExistReaction = await this.reactionRepository.exist({
      where: {
        reactionTypeId,
        userId,
        parentId,
      } as FindOptionsWhere<E>,
    });

    if (isExistReaction) {
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

  async remove(type: ReactionType, userId: number, parentId: number) {
    const reactionType = await this.findOneReactionTypeOrFail(type);
    const reactionTypeId = reactionType.id;

    const isExistReaction = await this.reactionRepository.exist({
      where: {
        reactionTypeId,
        userId,
        parentId,
      } as FindOptionsWhere<E>,
    });

    if (!isExistReaction) {
      throw new HttpConflictException({
        code: REACTION_ERROR_CODE.NOT_LIKED,
      });
    }

    await this.reactionRepository.delete({
      reactionTypeId,
      userId,
      parentId,
    } as FindOptionsWhere<E>);
  }

  private async findOneReactionTypeOrFail(
    reactionName: ReactionType,
  ): Promise<{ id: number }> {
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

    return {
      id: reactionType.id,
    };
  }
}
