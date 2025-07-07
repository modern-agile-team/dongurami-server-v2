import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { NoticePostDto } from '@src/apis/notice-posts/dto/notice-post.dto';

export const POST_ORDER_FIELD: readonly (keyof (
  | FreePostDto
  | NoticePostDto
))[] = ['userId', 'title', 'hit', 'createdAt', 'updatedAt'];
