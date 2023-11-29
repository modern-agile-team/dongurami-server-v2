import { BaseDto } from '@src/dto/base.dto';
import { NoticeBoard } from '@src/entities/NoticeBoard';

export class NoticeBoardDto
  extends BaseDto
  implements Pick<NoticeBoard, 'id' | 'userId'> {}
