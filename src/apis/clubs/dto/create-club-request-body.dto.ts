import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

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

  @ApiProperty({
    description: '동아리 태그 명',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];

  @ApiProperty({
    description: '동아리 카테고리 명',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  categories: string[];

  @IsDefined()
  status: ClubStatus = ClubStatus.Active;
}
