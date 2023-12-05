import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFreePostHistoryDto } from '@src/apis/free-posts/free-post-history/dto/create-free-post-history.dto';
import { HistoryAction } from '@src/constants/enum';
import { FreePostHistory } from '@src/entities/FreePostHistory';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class FreePostHistoryService {
  constructor(
    @InjectRepository(FreePostHistory)
    private readonly freePostHistoryRepository: Repository<FreePostHistory>,
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
}
