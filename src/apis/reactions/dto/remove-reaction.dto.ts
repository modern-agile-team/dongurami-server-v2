import { ApiProperty } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';

import { ReactionName } from '@src/apis/reactions/constants/reaction.enum';

export class RemoveReactionDto {
  @ApiProperty({
    description: 'reaction type',
    enum: ReactionName,
  })
  @IsEnum(ReactionName)
  type: ReactionName;
}
