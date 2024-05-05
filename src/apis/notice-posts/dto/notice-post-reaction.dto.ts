import { ApiProperty, PickType } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { ReactionName } from '@src/apis/reactions/constants/reaction.enum';
import { BaseDto } from '@src/dto/base.dto';
import { NoticePostReaction } from '@src/entities/NoticePostReaction';
import { ReactionType } from '@src/entities/ReactionType';

export class NoticePostReactionDto
  extends PickType(BaseDto, ['id', 'createdAt'] as const)
  implements
    Pick<
      NoticePostReaction,
      | 'id'
      | 'userId'
      | 'reactionTypeId'
      | 'parentId'
      | 'createdAt'
      | 'reactionType'
    >
{
  @ApiProperty({
    description: 'reaction 등록 유저 고유 ID',
    format: 'integer',
  })
  userId: number;

  @Exclude()
  reactionTypeId: number;

  @ApiProperty({
    description: '공지 게시글 고유 ID',
    format: 'integer',
    type: 'number',
  })
  @Expose({ toPlainOnly: true })
  get noticePostId() {
    return this.parentId;
  }

  @ApiProperty({
    description: 'reaction type',
    enum: ReactionName,
    type: 'string',
  })
  @Expose({ toPlainOnly: true })
  get type() {
    return this.reactionType.name;
  }

  @Exclude({ toPlainOnly: true })
  parentId: number;

  @Exclude({ toPlainOnly: true })
  reactionType: ReactionType;
}
