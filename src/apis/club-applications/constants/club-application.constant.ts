import { ClubApplicationDto } from '@src/apis/club-applications/dto/club-application.dto';

export const CLUB_APPLICATION_ORDER_FIELD: readonly (keyof ClubApplicationDto)[] =
  ['id', 'status', 'createdAt', 'updatedAt'];
