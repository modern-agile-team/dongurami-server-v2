import { ApiProperty } from '@nestjs/swagger';

import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';

export class ClubWithCategoryAndTagDto extends ClubDto {
  @ApiProperty({
    description: '클럽 카테고리 item',
    type: [ClubCategoryDto],
  })
  clubCategories: ClubCategoryDto[];

  @ApiProperty({
    description: '클럽 태그 item',
    type: [ClubTagDto],
  })
  clubTags: ClubTagDto[];

  constructor(clubWithCategoryAndTagDto: ClubWithCategoryAndTagDto) {
    super(clubWithCategoryAndTagDto);

    Object.assign(this, clubWithCategoryAndTagDto);
  }
}
