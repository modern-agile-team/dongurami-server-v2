import { ApiProperty, PickType } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { ReactionTypes } from '@src/apis/reactions/constants/reaction.enum';
import { BaseDto } from '@src/dto/base.dto';
import { FreePostReaction } from '@src/entities/FreePostReaction';

export class FreePostReactionDto
  extends PickType(BaseDto, ['id', 'createdAt'] as const)
  implements Pick<FreePostReaction, 'id' | 'userId' | 'parentId' | 'createdAt'>
{
  @ApiProperty({
    description: 'reaction 등록 유저 고유 ID',
    format: 'integer',
  })
  userId: number;

  @Exclude({ toPlainOnly: true })
  parentId: number;

  @ApiProperty({
    description: '자유 게시글 고유 ID',
    format: 'integer',
    type: 'number',
  })
  @Expose({ toPlainOnly: true })
  get freePostId() {
    return this.parentId;
  }

  @ApiProperty({
    description: 'reaction type',
    enum: ReactionTypes,
  })
  @Expose({ toPlainOnly: true })
  type: string;
}
