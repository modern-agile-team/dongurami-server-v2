import { Injectable } from '@nestjs/common';

import { CreateNoticePostHistoryDto } from '@src/apis/notice-posts/notice-post-history/dto/create-notice-post-history.dto';
import { NoticePostHistoryRepository } from '@src/apis/notice-posts/notice-post-history/repositories/notice-post-history.repository';
import { HistoryAction } from '@src/constants/enum';

@Injectable()
export class NoticePostHistoryService {
  constructor(
    private readonly noticePostHistoryRepository: NoticePostHistoryRepository,
  ) {}

  create(
    userId: number,
    noticePostId: number,
    action: HistoryAction,
    createNoticePostHistoryDto: CreateNoticePostHistoryDto,
  ) {
    return this.noticePostHistoryRepository.save({
      userId,
      noticePostId,
      action,
      ...new CreateNoticePostHistoryDto(createNoticePostHistoryDto),
    });
  }
}
