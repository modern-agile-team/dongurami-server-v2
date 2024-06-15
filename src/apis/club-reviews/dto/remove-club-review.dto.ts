import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';

export class RemoveClubReviewDto
  implements Pick<ClubReviewDto, 'id' | 'clubId' | 'userId'>
{
  id: number;
  clubId: number;
  userId: number;

  constructor(removeClubReviewDto: RemoveClubReviewDto) {
    Object.assign(this, removeClubReviewDto);
  }
}
