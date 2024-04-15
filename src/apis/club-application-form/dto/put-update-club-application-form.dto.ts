import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDate, IsObject, Validate } from 'class-validator';

import { ClubApplicationFormQuestionItemDto } from '@src/apis/club-application-form/dto/club-application-form-question-item.dto';
import { ClubApplicationFormDto } from '@src/apis/club-application-form/dto/club-application-form.dto';
import { IsAfterConstraint } from '@src/decorators/validators/is-after.decorator';
import { IsBeforeConstraint } from '@src/decorators/validators/is-before.decorator';
import { IsNullable } from '@src/decorators/validators/is-nullable.decorator';
import { ValidateClassInstance } from '@src/decorators/validators/validate-by-class.decorator';

export class PutUpdateClubApplicationFormDto
  implements
    Pick<ClubApplicationFormDto, 'customQuestion' | 'startsAt' | 'endsAt'>
{
  @ApiProperty({
    description: '커스텀 질문 항목',
    type: [ClubApplicationFormQuestionItemDto],
  })
  @ValidateClassInstance({ each: true })
  @IsObject({ each: true })
  @Type(() => ClubApplicationFormQuestionItemDto)
  customQuestion: ClubApplicationFormQuestionItemDto[];

  @ApiProperty({
    description: '지원서 시작일자, 종료일자보다 이후일 수 없음',
    nullable: true,
  })
  @Validate(IsBeforeConstraint, ['endsAt'])
  @IsDate()
  @IsNullable()
  @Type(() => Date)
  startsAt: Date | null;

  @ApiProperty({
    description: '지원서 종료 일자, 시작일자보다 이전일 수 없음',
    nullable: true,
  })
  @Validate(IsAfterConstraint, ['startsAt'])
  @IsDate()
  @IsNullable()
  @Type(() => Date)
  endsAt: Date | null;
}
