import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

import { ClubMemberRole } from '@src/apis/club-members/constants/club-member.enum';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { BaseDto } from '@src/dto/base.dto';
import { ClubMember } from '@src/entities/ClubMember';

export class ClubMemberDto
  extends IntersectionType(
    PickType(UserDto, [
      'majorId',
      'studentNumber',
      'name',
      'nickname',
      'email',
      'phoneNumber',
      'grade',
      'gender',
      'profilePath',
    ] as const),
    BaseDto,
  )
  implements Pick<ClubMember, 'id' | 'roles' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({
    description: '동아리원의 역할 리스트',
    enum: ClubMemberRole,
    type: [ClubMemberRole],
  })
  roles: ClubMemberRole[];

  constructor(clubMemberDto: Partial<ClubMemberDto> = {}) {
    super();

    Object.assign(this, clubMemberDto);
  }
}
