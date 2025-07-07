import { ClubPost } from '@src/entities/ClubPost';

export const CLUB_POST_DESCRIPTION_LENGTH = {
  MIN: 1,
} as const;

export const CLUB_POST_TAG_COUNT = {
  MIN: 0,
  MAX: 10,
} as const;

export const CLUB_POST_ORDER_FIELD: readonly (keyof ClubPost)[] = [
  'id',
  'userId',
  'createdAt',
  'updatedAt',
] as const;
