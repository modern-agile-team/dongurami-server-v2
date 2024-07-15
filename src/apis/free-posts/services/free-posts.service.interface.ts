import {
  FREE_POST_ORDER_FIELD,
  FreePost,
} from '@src/apis/free-posts/entities/free-post.entity';
import { EntityId } from '@src/common/base.entity';
import { OrderV2 } from '@src/dto/transformer/csv-to-order.decorator';

export interface CreateFreePostDto {
  userId: EntityId;
  title: string;
  description: string;
  isAnonymous: boolean;
  tagNames: string[];
}

export interface FindAllFreePostDto {
  id?: EntityId;
  userId?: EntityId;
  title?: string;
  isAnonymous?: boolean;
  order: OrderV2<typeof FREE_POST_ORDER_FIELD>;
  page: number;
  pageSize: number;
}

export interface PutUpdateFreePostDto {
  id: EntityId;
  userId: EntityId;
  title: string;
  description: string;
  isAnonymous: boolean;
  tagNames: string[];
}

export interface PatchUpdateFreePostDto {
  id: EntityId;
  userId: EntityId;
  title?: string;
  description?: string;
  isAnonymous?: boolean;
  tagNames?: string[];
}

export interface RemoveFreePostDto {
  id: EntityId;
  userId: EntityId;
}

export interface IFreePostsService {
  create(createFreePostDto: CreateFreePostDto): Promise<FreePost>;
  findAllAndCount(
    findAllFreePostDto: FindAllFreePostDto,
  ): Promise<[readonly FreePost[], number]>;
  findOneOrNotFound(id: EntityId): Promise<FreePost>;
  /**
   * @deprecated 제거예정
   */
  findOne(id: EntityId): Promise<FreePost>;
  putUpdate(putUpdateFreePostDto: PutUpdateFreePostDto): Promise<FreePost>;
  patchUpdate(
    patchUpdateFreePostDto: PatchUpdateFreePostDto,
  ): Promise<FreePost>;
  remove(removeFreePostDto: RemoveFreePostDto): Promise<number>;
  incrementHit(id: EntityId): Promise<void>;
}
