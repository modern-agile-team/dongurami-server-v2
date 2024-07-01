import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';

export class RemoveClubReviewDto
  implements Pick<ClubReviewDto, 'id' | 'clubId' | 'userId'>
{
  id: string;
  clubId: string;
  userId: string;

  constructor(removeClubReviewDto: RemoveClubReviewDto) {
    Object.assign(this, removeClubReviewDto);
  }
}
