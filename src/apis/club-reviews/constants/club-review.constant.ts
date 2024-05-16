import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';

export const CLUB_REVIEW_DESCRIPTION_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;

export const CLUB_REVIEW_STAR_RATE_RANGE = {
  MIN: 1,
  MAX: 5,
} as const;

export const CLUB_REVIEW_ORDER_FIELD: readonly (keyof ClubReviewDto)[] = [
  'id',
  'userId',
  'description',
  'starRate',
  'isAnonymous',
  'createdAt',
  'updatedAt',
] as const;
