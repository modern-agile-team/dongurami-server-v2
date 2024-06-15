import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';

export class PatchUpdateClubReviewDto
  implements
    Pick<ClubReviewDto, 'id' | 'clubId' | 'userId'>,
    Partial<Pick<ClubReviewDto, 'description' | 'starRate' | 'isAnonymous'>>
{
  id: number;
  clubId: number;
  userId: number;
  description?: string | null;
  starRate?: number;
  isAnonymous?: boolean;

  constructor(
    patchUpdateClubReviewDto: Partial<PatchUpdateClubReviewDto> = {},
  ) {
    this.id = patchUpdateClubReviewDto.id;
    this.clubId = patchUpdateClubReviewDto.clubId;
    this.userId = patchUpdateClubReviewDto.userId;

    if (patchUpdateClubReviewDto.description !== undefined) {
      this.description = patchUpdateClubReviewDto.description;
    }

    if (patchUpdateClubReviewDto.starRate !== undefined) {
      this.starRate = patchUpdateClubReviewDto.starRate;
    }

    if (patchUpdateClubReviewDto.isAnonymous !== undefined) {
      this.isAnonymous = patchUpdateClubReviewDto.isAnonymous;
    }
  }
}
