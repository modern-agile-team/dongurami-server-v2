import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';

export const FREE_BOARD_ORDER_FIELD: readonly (keyof FreeBoardDto)[] = [
  'id',
  'userId',
  'title',
  'hit',
  'isAnonymous',
  'createdAt',
  'updatedAt',
] as const;

export const FREE_BOARD_TITLE_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;
