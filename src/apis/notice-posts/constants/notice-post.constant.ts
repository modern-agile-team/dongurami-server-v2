import { NoticePostDto } from '@src/apis/notice-posts/dto/notice-post.dto';

export const NOTICE_POST_ORDER_FIELD: readonly (keyof NoticePostDto)[] = [
  'id',
  'userId',
  'title',
  'hit',
  'isAllowComment',
  'createdAt',
  'updatedAt',
] as const;

export const NOTICE_POST_TITLE_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;
