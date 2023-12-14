import { FreePostReplyCommentStatus } from '@src/apis/free-posts/free-post-comments/constants/free-post-comment.enum';
import { FreePostReplyCommentHistory } from '@src/entities/FreePostReplyCommentHistory';

export class CreateFreePostReplyCommentHistoryDto
  implements
    Pick<FreePostReplyCommentHistory, 'description' | 'isAnonymous' | 'status'>
{
  description: string;
  isAnonymous: boolean;
  status: FreePostReplyCommentStatus;

  constructor(
    createFreePostCommentHistoryDto: CreateFreePostReplyCommentHistoryDto,
  ) {
    this.description = createFreePostCommentHistoryDto.description;
    this.isAnonymous = createFreePostCommentHistoryDto.isAnonymous;
    this.status = createFreePostCommentHistoryDto.status;
  }
}
