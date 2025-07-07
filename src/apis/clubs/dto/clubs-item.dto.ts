import { ApiProperty, OmitType } from '@nestjs/swagger';

import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';

export class ClubsItemDto extends OmitType(ClubDto, [
  'introduce',
  'tags',
  'deletedAt',
]) {
  @ApiProperty({
    description: '동아리 카테고리 리스트',
    type: [ClubCategoryDto],
  })
  clubCategories: ClubCategoryDto[];

  @ApiProperty({
    description: '동아리 태그 리스트',
    type: [ClubTagDto],
  })
  clubTags: ClubTagDto[];
}
