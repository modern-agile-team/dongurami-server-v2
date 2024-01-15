import { ApiProperty } from "@nestjs/swagger";
import { UserLoginType } from "@src/apis/users/constants/user.enum";
import { IsEnum, IsString } from "class-validator";

export class CheckRegistrationRequestBodyDto {
    @ApiProperty({
        description: '로그인 타입',
        enum: UserLoginType,
        enumName: 'UserLoginType'
    })
    @IsEnum(UserLoginType)
    loginType: UserLoginType;

    @ApiProperty({ description: 'SNS 토큰' })
    @IsString()
    snsToken: string;
}