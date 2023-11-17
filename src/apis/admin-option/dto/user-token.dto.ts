import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class UserTokenDto {
  @IsNumber()
  id: number;

  @IsArray()
  clubId: number[];

  @IsString()
  name: string;

  @IsString()
  profilePath: string;

  @IsBoolean()
  isAdmin: boolean;
}
