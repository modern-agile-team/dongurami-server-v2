import { UserTokenDto } from '../dto/find-one-by-club-num.dto';

export function ClubJoinCheck(clubId: number, user: UserTokenDto) {
  const usersClub = user.clubId;

  if (!user.isAdmin) {
    if (!usersClub.includes(clubId) || usersClub.length === 0) {
    }
  }
}
