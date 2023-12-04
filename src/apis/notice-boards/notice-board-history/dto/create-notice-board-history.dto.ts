import { NoticeBoardHistory } from '@src/entities/NoticeBoardHistory';

export class CreateNoticeBoardHistoryDto
  implements
    Pick<NoticeBoardHistory, 'title' | 'description' | 'isAllowComment'>
{
  title: string;
  description: string;
  isAllowComment: boolean;

  constructor(createNoticeBoardHistoryDto: CreateNoticeBoardHistoryDto) {
    this.title = createNoticeBoardHistoryDto.title;
    this.description = createNoticeBoardHistoryDto.description;
    this.isAllowComment = createNoticeBoardHistoryDto.isAllowComment;
  }
}
