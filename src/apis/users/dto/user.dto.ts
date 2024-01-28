import { ApiProperty } from '@nestjs/swagger';
import { USER_GRADE } from '@src/apis/users/constants/user.constant';
import {
  UserGender,
  UserLoginType,
  UserRole,
  UserStatus,
} from '@src/apis/users/constants/user.enum';
import { PHONE_NUMBER_REGEXP } from '@src/constants/regexp.constant';
import { BaseDto } from '@src/dto/base.dto';
import { User } from '@src/entities/User';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UserDto
  extends BaseDto
  implements
    Pick<
      User,
      | 'id'
      | 'userMajorId'
      | 'loginType'
      | 'snsId'
      | 'studentNumber'
      | 'name'
      | 'nickname'
      | 'email'
      | 'phoneNumber'
      | 'grade'
      | 'gender'
      | 'profilePath'
      | 'role'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
{
  @ApiProperty({})
  userMajorId: number | null;

  @ApiProperty({
    description: '유저 로그인 타입',
    enum: UserLoginType,
  })
  loginType: UserLoginType;

  @ApiProperty({
    nullable: true,
  })
  snsId: string | null;

  @ApiProperty({
    description: 'SNS 토큰',
  })
  @IsOptional()
  snsToken?: string;

  @ApiProperty({
    nullable: true,
  })
  studentNumber: string | null;

  @ApiProperty({
    description: '유저 이름',
  })
  name: string | null;

  @ApiProperty({
    nullable: true,
  })
  nickname: string | null;

  @ApiProperty({
    description: '이메일',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: '핸드폰 번호',
    nullable: true,
    example: '010-0000-0000',
    type: () => String,
    format: String(PHONE_NUMBER_REGEXP),
  })
  phoneNumber: string | null;

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
    description: 'profile image path',
    nullable: true,
    example: 'path/user-image.jpeg',
    type: () => String,
  })
  profilePath: string | null;

  @ApiProperty({
    description: '유저 role',
    enum: UserRole,
  })
  role: UserRole;

  @Exclude()
  status: UserStatus;

  @Exclude()
  deletedAt: Date | null;

  constructor(userDto: Partial<UserDto> = {}) {
    super();

    Object.assign(this, userDto);
  }
}
