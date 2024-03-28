import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';

export const CLUB_CATEGORY_ORDER_FIELD: readonly (keyof ClubCategoryDto)[] = [
  'id',
  'name',
  'createdAt',
] as const;

export const CLUB_CATEGORY_NAME = {
  MIN: 1,
  MAX: 20,
} as const;

export const CLUB_CATEGORY_MEMO = {
  MIN: 1,
  MAX: 255,
} as const;
