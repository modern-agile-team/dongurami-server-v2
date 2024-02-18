import { FreePostCommentDto } from "@src/apis/free-post-comments/dto/free-post-comment.dto";

export const FREE_POST_COMMENT_ORDER_FIELD: readonly (keyof FreePostCommentDto)[] = [
  'id',
  'userId',
  'isAnonymous',
  'createdAt',
  'updatedAt',
] as const;

export const FREE_POST_COMMENT_DESCRIPTION_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;
