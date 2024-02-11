import { Injectable } from '@nestjs/common';
import { HistoryAction } from '@src/constants/enum';
import { FreePostCommentHistory } from '@src/entities/FreePostCommentHistory';
import { EntityManager, FindOneOptions } from 'typeorm';
import { CreateFreePostCommentHistoryDto } from '../dto/create-free-post-comment-history.dto';
import { FreePostCommentHistoryRepository } from '../repositories/free-post-comment-history.repository';

@Injectable()
export class FreePostCommentHistoryService {
  constructor(
    private readonly freePostCommentHistoryRepository: FreePostCommentHistoryRepository,
  ) {}

  async create(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    action: HistoryAction,
    createFreePostCommentHistoryDto: CreateFreePostCommentHistoryDto,
  ) {
    return this.freePostCommentHistoryRepository.save({
      userId,
      action,
      freePostId,
      freePostCommentId,
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
