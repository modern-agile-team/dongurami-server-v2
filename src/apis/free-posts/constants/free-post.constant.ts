import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';

export const FREE_POST_ORDER_FIELD: readonly (keyof FreePostDto)[] = [
  'id',
  'userId',
  'title',
  'hit',
  'isAnonymous',
  'createdAt',
  'updatedAt',
] as const;

export const FREE_POST_TITLE_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;
