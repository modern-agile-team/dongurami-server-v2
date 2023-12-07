import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticePostHistory } from '@src/entities/NoticePostHistory';
import { EntityManager, Repository } from 'typeorm';
import { CreateNoticePostHistoryDto } from '../dto/create-notice-post-history.dto';
import { HistoryAction } from '@src/constants/enum';

@Injectable()
export class NoticePostHistoryService {
  constructor(
    @InjectRepository(NoticePostHistory)
    private readonly noticePostHistoryRepository: Repository<NoticePostHistory>,
  ) {}
  create(
    entityManager: EntityManager,
    userId: number,
    noticePostId: number,
    action: HistoryAction,
    createNoticePostHistoryDto: CreateNoticePostHistoryDto,
  ) {
    return entityManager.withRepository(this.noticePostHistoryRepository).save({
      userId,
      noticePostId,
      action,
      ...new CreateNoticePostHistoryDto(createNoticePostHistoryDto),
    });
  }
}
