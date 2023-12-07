import { Injectable } from '@nestjs/common';
import { NoticePostHistoryRepository } from '@src/apis/notice-posts/notice-post-history/repositories/notice-post-history.repository';
import { HistoryAction } from '@src/constants/enum';
import { EntityManager } from 'typeorm';
import { CreateNoticePostHistoryDto } from '../dto/create-notice-post-history.dto';

@Injectable()
export class NoticePostHistoryService {
  constructor(
    private readonly noticePostHistoryRepository: NoticePostHistoryRepository,
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
