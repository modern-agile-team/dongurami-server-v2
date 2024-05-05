import { FreePostReactionDto } from '@src/apis/free-posts/dto/free-post-reaction.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';

export const FREE_POST_ORDER_FIELD: readonly (keyof FreePostDto)[] = [
  'id',
  'userId',
  'title',
  'hit',
  'isAnonymous',
  'createdAt',
  'updatedAt',
] as const;

export const FREE_POST_TITLE_LENGTH = {
  MIN: 1,
  MAX: 255,
} as const;

export const FREE_POST_REACTION_ORDER_FIELD: readonly (keyof FreePostReactionDto)[] =
  ['id', 'type', 'userId', 'createdAt'] as const;
