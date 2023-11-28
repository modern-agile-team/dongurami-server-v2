import { ApiProperty } from '@nestjs/swagger';
import { USER_GRADE } from '@src/apis/users/constants/user.constant';
import {
  UserGender,
  UserLoginType,
  UserRole,
} from '@src/apis/users/constants/user.enum';
import { PHONE_NUMBER_REGEXP } from '@src/constants/regexp.constant';
import { BaseDto } from '@src/dto/base.dto';
import { User } from '@src/entities/User';
import { Exclude } from 'class-transformer';

export class UserDto
  extends BaseDto
  implements
    Pick<
      User,
      | 'id'
      | 'loginType'
      | 'name'
      | 'password'
      | 'email'
      | 'phoneNumber'
      | 'grade'
      | 'gender'
      | 'profilePath'
      | 'role'
      | 'createdAt'
      | 'updatedAt'
    >
{
  @ApiProperty({
    description: '유저 이름',
  })
  name: string;

  @Exclude()
  password: string | null;

  @ApiProperty({
    description: '이메일',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: '유저 로그인 타입',
    enum: UserLoginType,
  })
  loginType: UserLoginType;

  @ApiProperty({
    description: '유저 role',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    description: '학년 (0이면 졸업)',
    type: Number,
    nullable: true,
    minimum: USER_GRADE.MIN,
    maximum: USER_GRADE.MAX,
  })
  grade: number | null;

  @ApiProperty({
    description: '성별',
    nullable: true,
    enum: UserGender,
  })
  gender: UserGender | null;

  @ApiProperty({
    description: '핸드폰 번호',
    nullable: true,
    example: '010-0000-0000',
    type: () => String,
    format: String(PHONE_NUMBER_REGEXP),
  })
  phoneNumber: string | null;

  @ApiProperty({
    description: 'profile image path',
    nullable: true,
    example: 'path/user-image.jpeg',
    type: () => String,
  })
  profilePath: string | null;

  constructor(userDto: Partial<UserDto> = {}) {
    super();

    Object.assign(this, userDto);
  }
}
