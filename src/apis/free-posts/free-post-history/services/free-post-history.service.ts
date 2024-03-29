import { Injectable } from '@nestjs/common';
import { CreateFreePostHistoryDto } from '@src/apis/free-posts/free-post-history/dto/create-free-post-history.dto';
import { FreePostHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-history.repository';
import { HistoryAction } from '@src/constants/enum';
import { FreePostHistory } from '@src/entities/FreePostHistory';
import { EntityManager, FindOneOptions } from 'typeorm';

@Injectable()
export class FreePostHistoryService {
  constructor(
    private readonly freePostHistoryRepository: FreePostHistoryRepository,
  ) {}

  create(
    entityManager: EntityManager,
    userId: number,
    freePostId: number,
    action: HistoryAction,
    createFreePostHistoryDto: CreateFreePostHistoryDto,
  ) {
    return entityManager.withRepository(this.freePostHistoryRepository).save({
      userId,
      freePostId,
      action,
      ...new CreateFreePostHistoryDto(createFreePostHistoryDto),
    });
  }

  findOneOrFail(
    entityManager: EntityManager,
    options: FindOneOptions<FreePostHistory>,
  ) {
    return entityManager
      .withRepository(this.freePostHistoryRepository)
      .findOneOrFail(options);
  }
}
