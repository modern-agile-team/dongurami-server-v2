import { ApiProperty, OmitType } from '@nestjs/swagger';

import { ClubApplicationFormQuestionItemDto } from '@src/apis/club-application-form/dto/club-application-form-question-item.dto';

export class ClubApplicationAnswerItemDto extends OmitType(
  ClubApplicationFormQuestionItemDto,
  ['id'] as const,
) {
  @ApiProperty({
    description: '동아리 지원서 답변 고유 ID',
  })
  id: string;

  @ApiProperty({
    description: '동아리 지원서 답변',
  })
  answer: string;
}
