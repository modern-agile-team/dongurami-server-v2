import { BaseDto } from '@src/dto/base.dto';
import { NoticeBoard } from '@src/entities/NoticeBoard';

export class NoticeBoardDto
  extends BaseDto
  implements
    Pick<
      NoticeBoard,
      'title' | 'description' | 'hit' | 'allowComment' | 'userId'
    >
{
  title: string;
  description: string;
  hit: number;
  allowComment: number;
  userId: number;
}
