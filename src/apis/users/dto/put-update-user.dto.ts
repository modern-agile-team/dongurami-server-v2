import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRequestBodyDto } from './create-user-request-body.dto';
import { IsEnum, IsString, Length, Max, Min } from 'class-validator';
import { USER_NAME_LENGTH, USER_GRADE } from '../constants/user.constant';
import { UserGender } from '../constants/user.enum';

export class PutUpdateUserDto
  implements
    Omit<
      CreateUserRequestBodyDto,
      'loginType' | 'role' | 'password' | 'phoneNumber' | 'email'
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
    description: 'grade 0은 졸업생',
    minimum: USER_GRADE.MIN,
    maximum: USER_GRADE.MAX,
  })
  @Min(USER_GRADE.MIN)
  @Max(USER_GRADE.MAX)
  grade: number;

  @ApiProperty({
    description: 'gender',
    enum: UserGender,
  })
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty({
    description:
      'url 이 아닌 profile path. ex) https://dongurami.s3.com/user/1/profile_image.jpeg => profile_image.jpeg',
    example: 'profile_image.jpg',
  })
  @IsString()
  profilePath: string;

  majorId: number;
}
