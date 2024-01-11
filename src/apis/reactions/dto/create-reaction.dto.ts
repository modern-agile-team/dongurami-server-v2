import { ApiProperty } from '@nestjs/swagger';
import { ReactionType } from '@src/apis/reactions/constants/reaction.enum';
import { IsEnum } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({
    description: 'reaction type',
    enum: ReactionType,
  })
  @IsEnum(ReactionType)
  type: ReactionType;
}
