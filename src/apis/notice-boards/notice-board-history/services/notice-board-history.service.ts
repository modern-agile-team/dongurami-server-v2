import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeBoardHistory } from '@src/entities/NoticeBoardHistory';
import { EntityManager, Repository } from 'typeorm';
import { CreateNoticeBoardHistoryDto } from '../dto/create-notice-board-history.dto';

@Injectable()
export class NoticeBoardHistoryService {
  constructor(
    @InjectRepository(NoticeBoardHistory)
    private readonly noticeBoardHistoryRepository: Repository<NoticeBoardHistory>,
  ) {}
  create(
    entityManager: EntityManager,
    userId: number,
    noticeBoardId: number,
    createNoticeBoardHistoryDto: CreateNoticeBoardHistoryDto,
  ) {
    return entityManager
      .withRepository(this.noticeBoardHistoryRepository)
      .save({
        userId,
        noticeBoardId,
        ...new CreateNoticeBoardHistoryDto(createNoticeBoardHistoryDto),
      });
  }
}
