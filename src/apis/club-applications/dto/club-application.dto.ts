import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { ClubApplicationStatus } from '@src/apis/club-applications/constants/club-application.enum';
import { ClubApplicationAnswerItemDto } from '@src/apis/club-applications/dto/club-application-answer-item.dto';
import { BaseDto } from '@src/dto/base.dto';
import { ClubApplication } from '@src/entities/ClubApplication';

export class ClubApplicationDto
  extends BaseDto
  implements
    Pick<
      ClubApplication,
      | 'id'
      | 'clubId'
      | 'userId'
      | 'answers'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
{
  @ApiProperty({
    description: '동아리 고유 ID',
    format: 'int64',
  })
  clubId: string;

  @ApiProperty({
    description: '지원 유저 고유 ID',
    format: 'int64',
  })
  userId: string;

  @ApiProperty({
    description: '지원서 답변',
    type: [ClubApplicationAnswerItemDto],
  })
  answers: ClubApplicationAnswerItemDto[];

  @ApiProperty({
    description: '지원서 상태',
  })
  status: ClubApplicationStatus;

  @Exclude()
  deletedAt: Date;

  constructor(clubApplicationDto: Partial<ClubApplicationDto> = {}) {
    super();

    Object.assign(this, clubApplicationDto);
  }
}
