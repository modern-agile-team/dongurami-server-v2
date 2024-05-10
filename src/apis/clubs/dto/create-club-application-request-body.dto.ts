import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsObject } from 'class-validator';

import { ClubApplicationStatus } from '@src/apis/club-applications/constants/club-application.enum';
import { ClubApplicationAnswersItemRequestDto } from '@src/apis/club-applications/dto/club-application-answers-item-request.dto';
import { ClubApplicationDto } from '@src/apis/club-applications/dto/club-application.dto';
import { ValidateClassInstance } from '@src/decorators/validators/validate-by-class.decorator';

export class CreateClubApplicationRequestBodyDto
  implements Pick<ClubApplicationDto, 'status'>
{
  @ApiProperty({
    description: '답변 리스트',
    type: [ClubApplicationAnswersItemRequestDto],
  })
  @ValidateClassInstance({ each: true })
  @IsObject({ each: true })
  @IsArray()
  @Type(() => ClubApplicationAnswersItemRequestDto)
  answers: ClubApplicationAnswersItemRequestDto[];

  @IsDefined()
  status = ClubApplicationStatus.Submit;
}
