import { ReactionType } from '@src/entities/ReactionType';

export interface RequiredReactionColumn {
  reactionTypeId: number;
  parentId: number;
  userId: number;
  reactionType: ReactionType;
}
