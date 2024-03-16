import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { ClubStatus } from '@src/apis/clubs/constants/club.enum';
import { BaseDto } from '@src/dto/base.dto';
import { Club } from '@src/entities/Club';

export class ClubDto
  extends BaseDto
  implements
    Pick<
      Club,
      | 'id'
      | 'userId'
      | 'name'
      | 'introduce'
      | 'logoPath'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
{
  @Exclude()
  userId: number;

  @ApiProperty({
    description: '동아리 명',
  })
  name: string;

  @ApiProperty({
    description: '동아리 소개',
  })
  introduce: string;

  @ApiProperty({
    description: '동아리 로고 path',
  })
  logoPath: string;

  @ApiProperty({
    description: '동아리 상태',
    enum: ClubStatus,
  })
  status: ClubStatus;

  @Exclude()
  deletedAt: Date;
}
