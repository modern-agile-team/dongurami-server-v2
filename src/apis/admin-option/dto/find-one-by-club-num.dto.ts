import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class UserTokenDto {
  @IsArray()
  clubId: number[];

  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  profilePath: string;

  @IsBoolean()
  isAdmin: boolean;
}
