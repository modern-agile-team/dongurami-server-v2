import { NoticeBoardDto } from '../dto/notice-post.dto';

export const NOTICE_BOARD_ORDER_FIELD: readonly (keyof NoticeBoardDto)[] = [
  'id',
  'userId',
  'title',
  'hit',
  'isAllowComment',
  'createdAt',
  'updatedAt',
] as const;

export const NOTICE_BOARD_TITLE_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;