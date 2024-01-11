import { ApiProperty } from '@nestjs/swagger';
import {
  USER_GRADE,
  USER_NAME_LENGTH,
} from '@src/apis/users/constants/user.constant';
import {
  UserGender,
  UserLoginType,
  UserRole,
} from '@src/apis/users/constants/user.enum';
import { USER_PASSWORD_REGEXP } from '@src/apis/users/constants/user.regexp';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { PHONE_NUMBER_REGEXP } from '@src/constants/regexp.constant';
import { IsNullable } from '@src/decorators/validators/is-nullable.decorator';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateUserRequestBodyDto
  implements
    Pick<UserDto, 'name' | 'email' | 'role' | 'loginType'>,
    Pick<
      UserDto,
      'password' | 'phoneNumber' | 'grade' | 'gender' | 'profilePath'
    >
{
  @ApiProperty({
    description: 'login type 현재 email 만',
    enum: UserLoginType,
  })
  @IsEnum(UserLoginType)
  loginType: UserLoginType;

  @ApiProperty({
    description: 'snsId',
  })
  snsId: string;

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
    description: 'role',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'password (email 로그인시에만 패턴 검사를 진행합니다.)',
    type: () => String,
    nullable: true,
    pattern: String(USER_PASSWORD_REGEXP),
  })
  @Matches(USER_PASSWORD_REGEXP)
  @IsOptional()
  @ValidateIf((object, value) => {
    if (object.loginType === UserLoginType.Email) {
      return true;
    }

    return value !== null;
  })
  password: string | null;

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

  /**
   * @todo 정규식 추가
   */
  @ApiProperty({
    description: 'url 이 아닌 profile path',
    type: () => String,
    nullable: true,
    example: 'user_image.jpg',
  })
  @IsString()
  @IsNullable()
  profilePath: string | null;

  /**
   * @todo 변경 예정
   */
  @IsOptional()
  majorId: number = 1;
}
