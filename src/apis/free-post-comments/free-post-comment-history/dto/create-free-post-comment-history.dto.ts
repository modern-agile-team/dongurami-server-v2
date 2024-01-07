import { FreePostCommentStatus } from '@src/apis/free-post-comments/constants/free-post-comment.enum';
import { FreePostCommentHistory } from '@src/entities/FreePostCommentHistory';

export class CreateFreePostCommentHistoryDto
  implements
    Pick<FreePostCommentHistory, 'description' | 'isAnonymous' | 'status'>
{
  description: string;
  isAnonymous: boolean;
  status: FreePostCommentStatus;

  constructor(
    createFreePostCommentHistoryDto: CreateFreePostCommentHistoryDto,
  ) {
    this.description = createFreePostCommentHistoryDto.description;
    this.isAnonymous = createFreePostCommentHistoryDto.isAnonymous;
    this.status = createFreePostCommentHistoryDto.status;
  }
}
