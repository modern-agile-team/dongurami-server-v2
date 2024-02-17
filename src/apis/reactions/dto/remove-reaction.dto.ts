import { ApiProperty } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';

import { ReactionType } from '@src/apis/reactions/constants/reaction.enum';

export class RemoveReactionDto {
  @ApiProperty({
    description: 'reaction type',
    enum: ReactionType,
  })
  @IsEnum(ReactionType)
  type: ReactionType;
}
