import { ClubPostCommentDto } from '@src/apis/club-post-comments/dto/club-post-comment.dto';

export const CLUB_POST_COMMENT_DESCRIPTION_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;

export const CLUB_POST_COMMENT_ORDER_FIELD: readonly (keyof ClubPostCommentDto)[] =
  ['id', 'isAnonymous', 'createdAt', 'updatedAt'] as const;
