import { ApiProperty } from '@nestjs/swagger';

import { QuestionInputType } from '@src/apis/club-application-form/constants/club-application-form.enum';
import { ClubApplicationFormQuestionItem } from '@src/apis/club-application-form/types/club-application-form.type';

export class ClubApplicationFormQuestionItemDto
  implements ClubApplicationFormQuestionItem
{
  @ApiProperty({
    description: '질문',
  })
  question: string;

  @ApiProperty({
    description: '입력 타입',
    enum: QuestionInputType,
  })
  inputType: QuestionInputType;

  @ApiProperty({
    description: '필수 항목 여부',
  })
  isRequired: boolean;

  @ApiProperty({
    description: '허용되는 값 리스트',
  })
  allowValues?: string[];
}
