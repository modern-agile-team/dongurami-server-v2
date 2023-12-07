import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserLoginType } from '@src/apis/users/constants/user.enum';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { IsString, ValidateIf } from 'class-validator';

export class SignInRequestBodyDto extends PickType(CreateUserRequestBodyDto, [
  'loginType',
  'email',
] as const) {
  @ApiProperty({
    description: 'password (email 로그인시에만 패턴 검사를 진행합니다.)',
    type: () => String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((object, value) => {
    if (object.loginType === UserLoginType.Email) {
      return true;
    }

    return value !== null;
  })
  password: string | null;
}
