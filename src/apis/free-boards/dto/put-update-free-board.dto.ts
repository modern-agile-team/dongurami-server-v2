import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateFreeBoardDto } from '@src/apis/free-boards/dto/create-free-board.dto';
import { IsBoolean } from 'class-validator';

export class PutUpdateFreeBoardDto extends PickType(CreateFreeBoardDto, [
  'title',
  'description',
] as const) {
  @ApiProperty({
    description: '익명 여부',
  })
  @IsBoolean()
  isAnonymous: boolean;
}
