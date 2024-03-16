import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { ClubCategoryLink } from '@src/entities/ClubCategoryLink';
import { ClubTagLink } from '@src/entities/ClubTagLink';

export class ClubsItemDto extends OmitType(ClubDto, ['introduce']) {
  @ApiProperty({
    description: '동아리 카테고리 리스트',
    type: [ClubCategoryDto],
  })
  @Expose({ toPlainOnly: true })
  get clubCategories() {
    return this.clubCategoryLinks.map(
      (clubCategoryLink) => clubCategoryLink.clubCategory,
    );
  }

  @ApiProperty({
    description: '동아리 태그 리스트',
    type: [ClubTagDto],
  })
  @Expose({ toPlainOnly: true })
  get clubTags() {
    return this.clubTagLinks.map((clubTagLink) => clubTagLink.clubTag);
  }

  @Exclude({ toPlainOnly: true })
  clubCategoryLinks: ClubCategoryLink[];
  @Exclude({ toPlainOnly: true })
  clubTagLinks: ClubTagLink[];
}
