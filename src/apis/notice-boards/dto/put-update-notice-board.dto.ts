import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateNoticeBoardDto } from './create-notice-board.dto';
import { IsBoolean } from 'class-validator';

export class PutUpdateNoticeBoardDto extends PickType(CreateNoticeBoardDto, [
  'title',
  'description',
] as const) {
  @ApiProperty({
    description: '댓글 허용 여부',
  })
  @IsBoolean()
  isAllowComment: boolean;
}
