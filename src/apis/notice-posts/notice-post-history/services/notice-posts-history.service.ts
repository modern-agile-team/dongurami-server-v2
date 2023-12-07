import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeBoardHistory } from '@src/entities/NoticePostHistory';
import { EntityManager, Repository } from 'typeorm';
import { CreateNoticeBoardHistoryDto } from '../dto/create-notice-post-history.dto';
import { HistoryAction } from '@src/constants/enum';

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
