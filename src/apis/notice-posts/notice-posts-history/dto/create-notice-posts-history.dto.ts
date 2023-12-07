import { NoticeBoardHistory } from '@src/entities/NoticePostHistory';
import { NoticeBoardStatus } from '../../constants/notice-post.enum';

export class CreateNoticeBoardHistoryDto
  implements
    Pick<
      NoticeBoardHistory,
      'title' | 'description' | 'isAllowComment' | 'status'
    >
{
  title: string;
  description: string;
  isAllowComment: boolean;
  status: NoticeBoardStatus;

  constructor(createNoticeBoardHistoryDto: CreateNoticeBoardHistoryDto) {
    this.title = createNoticeBoardHistoryDto.title;
    this.description = createNoticeBoardHistoryDto.description;
    this.isAllowComment = createNoticeBoardHistoryDto.isAllowComment;
    this.status = createNoticeBoardHistoryDto.status;
  }
}