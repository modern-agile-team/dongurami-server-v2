import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { CLUB_TAG_NAME } from '@src/apis/club-tags/constants/club-tag.constant';
import {
  CLUB_LOGO_PATH,
  CLUB_NAME_LENGTH,
} from '@src/apis/clubs/constants/club.constant';
import { ClubStatus } from '@src/apis/clubs/constants/club.enum';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { IsNullable } from '@src/decorators/validators/is-nullable.decorator';

export class CreateClubRequestBodyDto
  implements Pick<ClubDto, 'name' | 'status' | 'introduce' | 'logoPath'>
{
  @ApiProperty({
    description: '동아리 명',
    minLength: CLUB_NAME_LENGTH.MIN,
    maxLength: CLUB_NAME_LENGTH.MAX,
  })
  @Length(CLUB_NAME_LENGTH.MIN, CLUB_NAME_LENGTH.MAX)
  name: string;

  @ApiProperty({
    description: '동아리 소개',
    nullable: true,
  })
  @IsNullable()
  @IsString()
  @IsNotEmpty()
  introduce: string | null;

  @ApiProperty({
    description: '동아리 로고 (url이 아닌 path)',
    nullable: true,
    minLength: CLUB_LOGO_PATH.MIN,
    maxLength: CLUB_LOGO_PATH.MAX,
  })
  @IsNullable()
  @Length(CLUB_LOGO_PATH.MIN, CLUB_LOGO_PATH.MAX)
  logoPath: string | null;

  @ApiPropertyOptional({
    description: '동아리 태그 명',
    minLength: CLUB_TAG_NAME.MIN,
    maxLength: CLUB_TAG_NAME.MAX,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Length(CLUB_TAG_NAME.MIN, CLUB_TAG_NAME.MAX, { each: true })
  tagNames?: string[];

  @ApiProperty({
    description: '동아리 카테고리 명',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  categoryNames: string[];

  @IsDefined()
  status: ClubStatus = ClubStatus.Active;
}
