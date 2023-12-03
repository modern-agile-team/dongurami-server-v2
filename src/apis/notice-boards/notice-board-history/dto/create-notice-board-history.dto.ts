import { NoticeBoardHistory } from '@src/entities/NoticeBoardHistory';

export class CreateNoticeBoardHistoryDto
  implements Pick<NoticeBoardHistory, 'title' | 'description' | 'allowComment'>
{
  title: string;
  description: string;
  allowComment: boolean;

  constructor(createNoticeBoardHistoryDto: CreateNoticeBoardHistoryDto) {
    this.title = createNoticeBoardHistoryDto.title;
    this.description = createNoticeBoardHistoryDto.description;
    this.allowComment = createNoticeBoardHistoryDto.allowComment;
  }
}
