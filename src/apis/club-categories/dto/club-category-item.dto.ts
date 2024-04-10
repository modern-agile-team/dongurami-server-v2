import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';

export class ClubCategoryItemDto extends ClubCategoryDto {
  constructor(clubCategoryItemDto: Partial<ClubCategoryItemDto> = {}) {
    super();

    Object.assign(this, clubCategoryItemDto);
  }
}
