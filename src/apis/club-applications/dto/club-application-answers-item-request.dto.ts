import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class ClubApplicationAnswersItemRequestDto {
  @ApiProperty({
    description: '질문 고유번호',
  })
  @IsString()
  questionId: string;

  @ApiProperty({
    description: '답변',
  })
  @IsString()
  answer: string;
}
