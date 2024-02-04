import { ApiProperty } from '@nestjs/swagger';
import {
  USER_GRADE,
  USER_NAME_LENGTH,
} from '@src/apis/users/constants/user.constant';
import { UserGender, UserRole } from '@src/apis/users/constants/user.enum';
import { PHONE_NUMBER_REGEXP } from '@src/constants/regexp.constant';
import { IsNullable } from '@src/decorators/validators/is-nullable.decorator';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { CheckRegistrationRequestBodyDto } from './auth-registration.dto';

export class SignUpRequestBodyDto extends CheckRegistrationRequestBodyDto {
  @ApiProperty({
    description: 'name',
    minLength: USER_NAME_LENGTH.MIN,
    maxLength: USER_NAME_LENGTH.MAX,
  })
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  @IsNullable()
  name: string | null;

  @ApiProperty({
    description: 'email',
    format: 'email',
  })
  @IsEmail()
  @IsNullable()
  email: string | null;

  @ApiProperty({
    description: 'role',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsNullable()
  role: UserRole | null;

  @ApiProperty({
    description: 'phone number',
    example: '010-0000-0000',
    type: () => String,
    nullable: true,
    pattern: String(PHONE_NUMBER_REGEXP),
  })
  @Matches(PHONE_NUMBER_REGEXP)
  @IsNullable()
  phoneNumber: string | null;

  @ApiProperty({
    description: 'grade 0은 졸업생',
    type: () => Number,
    nullable: true,
    minimum: USER_GRADE.MIN,
    maximum: USER_GRADE.MAX,
  })
  @Min(USER_GRADE.MIN)
  @Max(USER_GRADE.MAX)
  @IsNullable()
  grade: number | null;

  @ApiProperty({
    description: 'gender',
    enum: UserGender,
    nullable: true,
  })
  @IsEnum(UserGender)
  @IsNullable()
  gender: UserGender | null;

  @ApiProperty({
    description: 'url 이 아닌 profile path',
    type: () => String,
    nullable: true,
    example: 'user_image.jpg',
  })
  @IsString()
  @IsNullable()
  profilePath: string | null;

  @IsInt()
  @IsNullable()
  majorId: number | null;
}

export class SignInRequestBodyDto extends CheckRegistrationRequestBodyDto {}
