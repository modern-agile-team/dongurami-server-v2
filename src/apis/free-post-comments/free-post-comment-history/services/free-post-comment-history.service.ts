import { Injectable } from '@nestjs/common';
import { FreePostHistoryService } from '@src/apis/free-posts/free-post-history/services/free-post-history.service';
import { HistoryAction, SortOrder } from '@src/constants/enum';
import { FreePostCommentHistory } from '@src/entities/FreePostCommentHistory';
import { EntityManager, FindOneOptions } from 'typeorm';
import { CreateFreePostCommentHistoryDto } from '../dto/create-free-post-comment-history.dto';
import { FreePostCommentHistoryRepository } from '../repositories/free-post-comment-history.repository';

@Injectable()
export class FreePostCommentHistoryService {
  constructor(
    private readonly freePostHistoryService: FreePostHistoryService,
    private readonly freePostCommentHistoryRepository: FreePostCommentHistoryRepository,
  ) {}

  async create(
    entityManager: EntityManager,
    userId: number,
    freePostId: number,
    action: HistoryAction,
    createFreePostCommentHistoryDto: CreateFreePostCommentHistoryDto,
  ) {
    const recentFreePostHistory =
      await this.freePostHistoryService.findOneOrFail(entityManager, {
        select: {
          id: true,
        },
        where: {
          freePostId,
        },
        order: {
          id: SortOrder.Desc,
        },
      });

    return entityManager
      .withRepository(this.freePostCommentHistoryRepository)
      .save({
        userId,
        action,
        freePostHistoryId: recentFreePostHistory.id,
        ...new CreateFreePostCommentHistoryDto(createFreePostCommentHistoryDto),
      });
  }

  findOneOrFail(
    entityManager: EntityManager,
    options: FindOneOptions<FreePostCommentHistory>,
  ) {
    return entityManager
      .withRepository(this.freePostCommentHistoryRepository)
      .findOneOrFail(options);
  }
}
