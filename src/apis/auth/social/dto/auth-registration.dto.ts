import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsString } from 'class-validator';

import { UserLoginType } from '@src/apis/users/constants/user.enum';

export class CheckRegistrationRequestBodyDto {
  @ApiProperty({
    description: '로그인 타입',
    enum: UserLoginType,
    enumName: 'UserLoginType',
  })
  @IsEnum(UserLoginType)
  loginType: UserLoginType;

  @ApiProperty({ description: 'SNS 토큰' })
  @IsString()
  snsToken: string;
}
