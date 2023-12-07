import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryAction } from '@src/constants/enum';
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
    action: HistoryAction,
    createNoticeBoardHistoryDto: CreateNoticeBoardHistoryDto,
  ) {
    return entityManager
      .withRepository(this.noticeBoardHistoryRepository)
      .save({
        userId,
        noticeBoardId,
        action,
        ...new CreateNoticeBoardHistoryDto(createNoticeBoardHistoryDto),
      });
  }
}
