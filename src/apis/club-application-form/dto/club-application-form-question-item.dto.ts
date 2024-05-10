import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsString,
  ValidateIf,
} from 'class-validator';

import { QuestionInputType } from '@src/apis/club-application-form/constants/club-application-form.enum';
import { ClubApplicationFormQuestionItem } from '@src/apis/club-application-form/types/club-application-form.type';

export class ClubApplicationFormQuestionItemDto
  implements ClubApplicationFormQuestionItem
{
  @ApiProperty({
    description: '지원서 폼 질문 고유 ID',
  })
  @IsDefined()
  id: string;

  @ApiProperty({
    description: '질문',
  })
  @IsString()
  question: string;

  @ApiProperty({
    description: '입력 타입',
    enum: QuestionInputType,
  })
  @IsEnum(QuestionInputType)
  inputType: QuestionInputType;

  @ApiProperty({
    description: '필수 항목 여부',
  })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({
    description:
      '허용되는 값 리스트, inputType이 text, file이라면 해당 값은 무시됨',
  })
  @ValidateIf(
    (o) =>
      o.inputType === QuestionInputType.CheckBox ||
      o.inputType === QuestionInputType.Radio,
  )
  @IsString({ each: true })
  @Transform(({ obj, value }) => {
    if (
      obj.inputType === QuestionInputType.File ||
      obj.inputType === QuestionInputType.Text
    ) {
      return;
    }

    return value;
  })
  allowValues?: string[];
}
