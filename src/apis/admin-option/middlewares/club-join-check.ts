import { ForbiddenException } from '@nestjs/common';
import { UserTokenDto } from '../dto/user-token.dto';

export function ClubJoinCheck(clubId: number, user: UserTokenDto) {
  const usersClub = user.clubId;

  if (!user.isAdmin) {
    if (!usersClub.includes(clubId) || usersClub.length === 0) {
      throw new ForbiddenException('해당 동아리에 가입하지 않았습니다.');
    }
  }
  return true;
}
