import { ApiProperty, PickType } from '@nestjs/swagger';

import { CLUB_POST_TAG_NAME_LENGTH } from '@src/apis/club-post-tags/constants/club-post-tag.constant';
import { BaseDto } from '@src/dto/base.dto';
import { ClubPostTag } from '@src/entities/ClubPostTag';

export class ClubPostTagDto
  extends PickType(BaseDto, ['id', 'createdAt'])
  implements Pick<ClubPostTag, 'id' | 'userId' | 'name' | 'createdAt'>
{
  @ApiProperty({
    description: '동아리 게시글 태그 생성 유저 고유 ID',
    minimum: 1,
  })
  userId: number;

  @ApiProperty({
    description: '동아리 게시글 태그 명',
    minLength: CLUB_POST_TAG_NAME_LENGTH.MIN,
    maxLength: CLUB_POST_TAG_NAME_LENGTH.MAX,
  })
  name: string;

  constructor(clubPostTagDto: Partial<ClubPostTagDto> = {}) {
    super();

    Object.assign(this, clubPostTagDto);
  }
}
