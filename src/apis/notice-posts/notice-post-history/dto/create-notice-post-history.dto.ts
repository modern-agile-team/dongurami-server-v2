import { NoticePostHistory } from '@src/entities/NoticePostHistory';
import { NoticePostStatus } from '../../constants/notice-post.enum';

export class CreateNoticePostHistoryDto
  implements
    Pick<
      NoticePostHistory,
      'title' | 'description' | 'isAllowComment' | 'status'
    >
{
  title: string;
  description: string;
  isAllowComment: boolean;
  status: NoticePostStatus;

  constructor(createNoticePostHistoryDto: CreateNoticePostHistoryDto) {
    this.title = createNoticePostHistoryDto.title;
    this.description = createNoticePostHistoryDto.description;
    this.isAllowComment = createNoticePostHistoryDto.isAllowComment;
    this.status = createNoticePostHistoryDto.status;
  }
}
