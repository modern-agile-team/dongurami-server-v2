import { NoticeBoardDto } from '../dto/notice-board.dto';

export const NOTICE_BOARD_ORDER_FIELD: readonly (keyof NoticeBoardDto)[] = [
  'id',
  'userId',
  'title',
  'hit',
  'allowComment',
  'createdAt',
  'updatedAt',
] as const;

export const NOTICE_BOARD_TITLE_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;

export const NOTICE_BOARD_ALLOW_COMMENT_LENGTH = {
  MIN: 0,
  MAX: 1,
};
