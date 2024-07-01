import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';

export class CreateClubReviewDto
  implements
    Pick<
      ClubReviewDto,
      'clubId' | 'userId' | 'description' | 'starRate' | 'isAnonymous'
    >
{
  clubId: string;
  userId: string;
  description: string | null;
  starRate: number;
  isAnonymous: boolean;

  constructor(createClubReviewDto: Partial<CreateClubReviewDto> = {}) {
    Object.assign(this, createClubReviewDto);
  }
}
