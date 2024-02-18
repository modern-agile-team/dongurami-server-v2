import { NoticePostCommentDto } from '@src/apis/notice-post-comments/dto/notice-post-comment.dto';

export const NOTICE_POST_COMMENT_ORDER_FIELD: readonly (keyof NoticePostCommentDto)[] =
  ['id', 'userId', 'isAnonymous', 'createdAt', 'updatedAt'] as const;

export const NOTICE_POST_COMMENT_DESCRIPTION_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;
