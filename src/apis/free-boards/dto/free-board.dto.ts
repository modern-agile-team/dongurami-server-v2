import { ApiProperty } from '@nestjs/swagger';
import { FREE_BOARD_TITLE_LENGTH } from '@src/apis/free-boards/constants/free-board.constant';
import { FreeBoardStatus } from '@src/apis/free-boards/constants/free-board.enum';
import { BaseDto } from '@src/dto/base.dto';
import { FreePost } from '@src/entities/FreePost';
import { Exclude } from 'class-transformer';

export class FreeBoardDto
  extends BaseDto
  implements
    Pick<
      FreePost,
      | 'id'
      | 'userId'
      | 'title'
      | 'description'
      | 'hit'
      | 'isAnonymous'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
{
  @ApiProperty({
    description: '게시글 작성자 고유 ID',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: '제목',
    minLength: FREE_BOARD_TITLE_LENGTH.MIN,
    maxLength: FREE_BOARD_TITLE_LENGTH.MAX,
  })
  title: string;

  @ApiProperty({
    description: '본문',
  })
  description: string;

  @ApiProperty({
    description: '조회수',
    default: 0,
    format: 'integer',
  })
  hit: number;

  @ApiProperty({
    description: '익명 여부',
  })
  isAnonymous: boolean;

  @Exclude()
  status: FreeBoardStatus;

  @Exclude()
  deletedAt: Date;

  constructor(freeBoardDto: Partial<FreeBoardDto> = {}) {
    super();

    Object.assign(this, freeBoardDto);
  }
}
