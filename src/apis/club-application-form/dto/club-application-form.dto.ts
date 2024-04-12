import { ApiProperty } from '@nestjs/swagger';

import { ClubApplicationFormQuestionItemDto } from '@src/apis/club-application-form/dto/club-application-form-question-item.dto';
import { BaseDto } from '@src/dto/base.dto';
import { ClubApplicationForm } from '@src/entities/ClubApplicationForm';

export class ClubApplicationFormDto
  extends BaseDto
  implements
    Pick<
      ClubApplicationForm,
      | 'id'
      | 'commonQuestion'
      | 'customQuestion'
      | 'startsAt'
      | 'endsAt'
      | 'createdAt'
      | 'updatedAt'
    >
{
  @ApiProperty({
    description: '공통 기본 지원서 질문항목',
  })
  commonQuestion: ClubApplicationFormQuestionItemDto[];

  @ApiProperty({
    description: '커스텀 질문 항목',
  })
  customQuestion: ClubApplicationFormQuestionItemDto[];

  @ApiProperty({
    description: '지원서 시작일자',
  })
  startsAt: Date | null;

  @ApiProperty({
    description: '지원서 종료일자',
  })
  endsAt: Date | null;

  constructor(clubApplicationFormDto: Partial<ClubApplicationFormDto> = {}) {
    super();

    Object.assign(this, clubApplicationFormDto);
  }
}
