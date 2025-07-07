import { ReactionType } from '@src/entities/ReactionType';

export interface RequiredReactionColumn {
  id: string;
  reactionTypeId: string;
  parentId: string;
  userId: string;
  reactionType: ReactionType;
}
