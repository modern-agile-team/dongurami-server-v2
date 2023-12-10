import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ReactionName } from '@src/apis/reactions/constants/reaction.enum';
import { REACTION_REPOSITORY_TOKEN } from '@src/apis/reactions/constants/reaction.token';
import { ReactionTypeRepository } from '@src/apis/reactions/repositories/reaction-type.repository';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { REACTION_ERROR_CODE } from '@src/constants/error/raction/raction-error-code.constant';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { DataSource, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

interface RequiredColumn {
  reactionTypeId: number;
  parentId: number;
  userId: number;
}

@Injectable()
export class ReactionsService<E extends RequiredColumn>
  implements OnModuleInit
{
  private reactionRepository: Repository<E>;

  constructor(
    @Inject(REACTION_REPOSITORY_TOKEN)
    private readonly ReactionRepository: typeof Repository,
    private readonly reactionTypeRepository: ReactionTypeRepository,

    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    this.reactionRepository = this.dataSource.getRepository<E>(
      this.ReactionRepository,
    );
  }

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
