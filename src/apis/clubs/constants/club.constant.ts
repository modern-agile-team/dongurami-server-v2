import { ClubDto } from '@src/apis/clubs/dto/club.dto';

export const CLUB_ORDER_FIELD: readonly (keyof ClubDto)[] = [
  'id',
  'name',
  'createdAt',
] as const;
