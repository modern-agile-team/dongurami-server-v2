import { Injectable } from '@nestjs/common';

import { isNotEmptyObject } from 'class-validator';
import { Transactional } from 'typeorm-transactional';

import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';
import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { CreateFreePostDto } from '@src/apis/free-posts/dto/create-free-post.dto';
import { FindFreePostListQueryDto } from '@src/apis/free-posts/dto/find-free-post-list-query.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { FreePostsItemDto } from '@src/apis/free-posts/dto/free-posts-item.dto';
import { PatchUpdateFreePostDto } from '@src/apis/free-posts/dto/patch-update-free-post.dto.td';
import { PutUpdateFreePostDto } from '@src/apis/free-posts/dto/put-update-free-post.dto';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { FreePost } from '@src/entities/FreePost';
import { FreePostReaction } from '@src/entities/FreePostReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class FreePostsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<
    FreePostDto,
    'title'
  >)[] = ['title'];

  constructor(
    private readonly commonPostsService: CommonPostsService<FreePost>,
    private readonly reactionsService: ReactionsService<FreePostReaction>,

    private readonly queryHelper: QueryHelper,

    private readonly freePostRepository: FreePostRepository,
  ) {}

  @Transactional()
  async create(userId: number, createFreePostDto: CreateFreePostDto) {
    const newPost = await this.freePostRepository.save({
      userId,
      status: FreePostStatus.Posting,
      ...createFreePostDto,
    });

    return new FreePostDto(newPost);
  }

  findAllAndCount(
    findFreePostListQueryDto: FindFreePostListQueryDto,
  ): Promise<[FreePostsItemDto[], number]> {
    const { page, pageSize, order, ...filter } = findFreePostListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    return this.freePostRepository.findAndCount({
      select: {
        id: true,
        userId: true,
        title: true,
        hit: true,
        isAnonymous: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });
  }

  async findOneOrNotFound(freePostId: number): Promise<FreePostDto> {
    const freePost = await this.freePostRepository.findOneBy({
      id: freePostId,
      status: FreePostStatus.Posting,
    });

    if (!freePost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new FreePostDto(freePost);
  }

  @Transactional()
  async putUpdate(
    userId: number,
    freePostId: number,
    putUpdateFreePostDto: PutUpdateFreePostDto,
  ): Promise<FreePostDto> {
    const oldFreePost = await this.findOneOrNotFound(freePostId);

    if (userId !== oldFreePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }
    const newFreePost = this.freePostRepository.create({
      ...oldFreePost,
      ...putUpdateFreePostDto,
    });

    await this.freePostRepository.update(
      {
        id: freePostId,
      },
      {
        ...newFreePost,
      },
    );

    return new FreePostDto(newFreePost);
  }

  @Transactional()
  async patchUpdate(
    userId: number,
    freePostId: number,
    patchUpdateFreePostDto: PatchUpdateFreePostDto,
  ): Promise<FreePostDto> {
    if (!isNotEmptyObject(patchUpdateFreePostDto)) {
      throw new HttpBadRequestException({
        code: ERROR_CODE.MISSING_UPDATE_FIELD,
      });
    }

    const oldFreePost = await this.findOneOrNotFound(freePostId);

    if (userId !== oldFreePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const newFreePost = this.freePostRepository.create({
      ...oldFreePost,
      ...patchUpdateFreePostDto,
    });

    await this.freePostRepository.update(
      {
        id: freePostId,
      },
      {
        ...newFreePost,
      },
    );

    return new FreePostDto(newFreePost);
  }

  @Transactional()
  async remove(userId: number, freePostId: number): Promise<number> {
    const existFreePost = await this.findOneOrNotFound(freePostId);

    if (userId !== existFreePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const freePostUpdateResult = await this.freePostRepository.update(
      {
        id: freePostId,
      },
      {
        ...existFreePost,
        status: FreePostStatus.Remove,
        deletedAt: new Date(),
      },
    );

    return freePostUpdateResult.affected;
  }

  incrementHit(freePostId: number): Promise<void> {
    return this.commonPostsService.incrementHit(freePostId);
  }

  async createReaction(
    userId: number,
    freePostId: number,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    const existPost = await this.findOneOrNotFound(freePostId);

    return this.reactionsService.create(
      createReactionDto.type,
      userId,
      existPost.id,
    );
  }

  async removeReaction(
    userId: number,
    freePostId: number,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    const existPost = await this.findOneOrNotFound(freePostId);

    return this.reactionsService.remove(
      removeReactionDto.type,
      userId,
      existPost.id,
    );
  }
}
