import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional, ValidateNested } from 'class-validator';

import { ClubApplicationAnswersItemRequestDto } from '@src/apis/club-applications/dto/club-application-answers-item-request.dto';
import { CreateClubApplicationDto } from '@src/apis/club-applications/dto/create-club-application.dto';

export class PatchUpdateClubApplicationDto
  implements Partial<CreateClubApplicationDto>
{
  @ApiPropertyOptional({
    description: '답변 리스트',
    type: [ClubApplicationAnswersItemRequestDto],
  })
  @ValidateNested()
  @IsObject({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => ClubApplicationAnswersItemRequestDto)
  answers?: ClubApplicationAnswersItemRequestDto[];
}
