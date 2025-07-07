import { ClubDto } from '@src/apis/clubs/dto/club.dto';

export const CLUB_ORDER_FIELD: readonly (keyof ClubDto)[] = [
  'id',
  'name',
  'createdAt',
] as const;

export const CLUB_NAME_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;

export const CLUB_LOGO_PATH = {
  MIN: 1,
  MAX: 255,
} as const;
