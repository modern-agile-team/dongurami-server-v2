import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsString } from 'class-validator';

import { CreateUserDto } from '@src/apis/users/dto/create-user.dto';
import { IsNullable } from '@src/decorators/validators/is-nullable.decorator';

export class PutUpdateUserDto extends PickType(CreateUserDto, [
  'name',
  'grade',
  'gender',
]) {
  /**
   * @todo 변경 가능성 있음.
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

  majorId: number;
}
