import { FREE_POST_REACTION_ORDER_FIELD } from '@src/apis/free-posts/entities/free-post.entity';
import { ReactionName } from '@src/apis/reactions/constants/reaction.enum';
import { EntityId } from '@src/common/base.entity';
import { OrderV2 } from '@src/dto/transformer/csv-to-order.decorator';
import { FreePostReaction } from '@src/entities/FreePostReaction';

export interface CreateFreePostReactionDto {
  postId: EntityId;
  userId: EntityId;
  reactionName: ReactionName;
}

export interface FindAllFreePostReactionDto {
  postId?: EntityId;
  userId?: EntityId;
  reactionName?: ReactionName;
  order: OrderV2<typeof FREE_POST_REACTION_ORDER_FIELD>;
  page: number;
  pageSize: number;
}

export interface RemoveFreePostReactionDto {
  postId: EntityId;
  userId: EntityId;
  reactionName: ReactionName;
}

export interface IFreePostReactionsService {
  createReaction(
    createFreePostReactionDto: CreateFreePostReactionDto,
  ): Promise<void>;
  findAllAndCountReactions(
    findAllFreePostReactionDto: FindAllFreePostReactionDto,
  ): Promise<[FreePostReaction[], number]>;
  removeReaction(
    removeFreePostReactionDto: RemoveFreePostReactionDto,
  ): Promise<void>;
}
