import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRequestBodyDto } from './create-user-request-body.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { PHONE_NUMBER_REGEXP } from '@src/constants/regexp.constant';
import { USER_NAME_LENGTH, USER_GRADE } from '../constants/user.constant';

export class PutUpdateUserDto
  implements
    Omit<
      CreateUserRequestBodyDto,
      'loginType' | 'role' | 'password' | 'gender'
    >
{
  @ApiProperty({
    description: 'name',
    minLength: USER_NAME_LENGTH.MIN,
    maxLength: USER_NAME_LENGTH.MAX,
  })
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  name: string;

  @ApiProperty({
    description: 'email',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'phone number',
    example: '010-0000-0000',
    type: () => String,
    nullable: true,
    pattern: String(PHONE_NUMBER_REGEXP),
  })
  @Matches(PHONE_NUMBER_REGEXP)
  phoneNumber: string;

  @ApiProperty({
    description: 'grade 0은 졸업생',
    type: () => Number,
    nullable: true,
    minimum: USER_GRADE.MIN,
    maximum: USER_GRADE.MAX,
  })
  @Min(USER_GRADE.MIN)
  @Max(USER_GRADE.MAX)
  grade: number;

  @ApiProperty({
    description: 'url 이 아닌 profile path',
    type: () => String,
    nullable: true,
    example: 'user_image.jpg',
  })
  @IsString()
  profilePath: string;

  /**
   * @todo 변경 예정
   */
  @IsOptional()
  majorId: number = 1;
}
