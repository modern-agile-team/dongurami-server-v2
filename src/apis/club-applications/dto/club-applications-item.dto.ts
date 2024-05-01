import { ApiProperty, PickType } from '@nestjs/swagger';

import { ClubApplicationDto } from '@src/apis/club-applications/dto/club-application.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';

export class ClubApplicationsItemDto extends PickType(ClubApplicationDto, [
  'id',
  'clubId',
  'userId',
  'status',
  'createdAt',
  'updatedAt',
] as const) {
  @ApiProperty({
    description: '동아리 지원 유저 정보',
  })
  user: UserDto;
}
