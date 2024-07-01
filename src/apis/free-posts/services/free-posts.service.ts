import { Injectable } from '@nestjs/common';

import { isNotEmptyObject } from 'class-validator';
import { differenceWith } from 'lodash';
import { getTsid } from 'tsid-ts';
import { Transactional } from 'typeorm-transactional';

import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';
import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { CreateFreePostDto } from '@src/apis/free-posts/dto/create-free-post.dto';
import { FindFreePostListQueryDto } from '@src/apis/free-posts/dto/find-free-post-list-query.dto';
import { FindFreePostReactionListQueryDto } from '@src/apis/free-posts/dto/find-free-post-reactions-list-query.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { FreePostsItemDto } from '@src/apis/free-posts/dto/free-posts-item.dto';
import { PatchUpdateFreePostDto } from '@src/apis/free-posts/dto/patch-update-free-post.dto';
import { PutUpdateFreePostDto } from '@src/apis/free-posts/dto/put-update-free-post.dto';
import { FreePostTagLinkRepository } from '@src/apis/free-posts/repositories/free-post-tag-link.repository';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { PostTagDto } from '@src/apis/post-tags/dto/post-tag.dto';
import { PostTagsService } from '@src/apis/post-tags/services/post-tags.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { UsersService } from '@src/apis/users/services/users.service';
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
    private readonly postTagsService: PostTagsService,
    private readonly usersService: UsersService,

    private readonly queryHelper: QueryHelper,

    private readonly freePostRepository: FreePostRepository,
    private readonly freePostTagLinkRepository: FreePostTagLinkRepository,
  ) {}

  @Transactional()
  async create(userId: string, createFreePostDto: CreateFreePostDto) {
    const { tagNames, ...postProps } = createFreePostDto;

    const postTags = await this.postTagsService.bulkCreate(
      userId,
      tagNames.map((tagName) => ({
        name: tagName,
      })),
    );

    const newPost = await this.freePostRepository.save({
      id: getTsid().toBigInt().toString(),
      userId,
      status: FreePostStatus.Posting,
      ...postProps,
      tags: postTags,
    });

    const postingUser = await this.usersService.findOneById(userId);

    await this.bulkAppendTagLink(userId, newPost.id, postTags);

    return new FreePostDto({ ...newPost, postTags, user: postingUser });
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
      relations: {
        user: true,
      },
    });
  }

  async findOneOrNotFound(freePostId: string): Promise<FreePostDto> {
    const freePost = await this.freePostRepository.findOne({
      where: {
        id: freePostId,
        status: FreePostStatus.Posting,
      },
      relations: {
        user: true,
      },
    });

    if (!freePost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const postTags = await this.findPostTags(freePostId);

    return new FreePostDto({ ...freePost, postTags });
  }

  async findOne(freePostId: string): Promise<FreePostDto | void> {
    const freePost = await this.freePostRepository.findOneBy({
      id: freePostId,
      status: FreePostStatus.Posting,
    });

    if (!freePost) {
      return;
    }

    return new FreePostDto(freePost);
  }

  @Transactional()
  async putUpdate(
    userId: string,
    freePostId: string,
    putUpdateFreePostDto: PutUpdateFreePostDto,
  ): Promise<FreePostDto> {
    const { tagNames, ...postProps } = putUpdateFreePostDto;

    const oldFreePost = await this.findOneOrNotFound(freePostId);

    if (userId !== oldFreePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    await this.freePostTagLinkRepository.delete({
      freePostId,
    });

    const postTags = await this.postTagsService.bulkCreate(
      userId,
      tagNames.map((tagName) => ({ name: tagName })),
    );

    const newFreePost = this.freePostRepository.create({
      ...oldFreePost,
      ...postProps,
      tags: postTags,
    });

    await this.freePostRepository.update(
      {
        id: freePostId,
      },
      {
        ...newFreePost,
      },
    );

    await this.bulkAppendTagLink(userId, newFreePost.id, postTags);

    return new FreePostDto({ ...newFreePost, postTags });
  }

  @Transactional()
  async patchUpdate(
    userId: string,
    freePostId: string,
    patchUpdateFreePostDto: PatchUpdateFreePostDto,
  ): Promise<FreePostDto> {
    if (!isNotEmptyObject(patchUpdateFreePostDto)) {
      throw new HttpBadRequestException({
        code: ERROR_CODE.MISSING_UPDATE_FIELD,
      });
    }

    const { tagNames, ...postProps } = patchUpdateFreePostDto;

    const oldFreePost = await this.findOneOrNotFound(freePostId);

    if (userId !== oldFreePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    let postTags: PostTagDto[];

    if (tagNames) {
      await this.freePostTagLinkRepository.delete({
        freePostId,
      });

      postTags = await this.postTagsService.bulkCreate(
        userId,
        tagNames.map((tagName) => ({ name: tagName })),
      );

      await this.bulkAppendTagLink(userId, freePostId, postTags);
    } else {
      postTags = await this.findPostTags(freePostId);
    }

    const newFreePost = this.freePostRepository.create({
      ...oldFreePost,
      ...postProps,
      tags: postTags,
    });

    await this.freePostRepository.update(
      {
        id: freePostId,
      },
      {
        ...newFreePost,
      },
    );

    return new FreePostDto({ ...newFreePost, postTags });
  }

  @Transactional()
  async remove(userId: string, freePostId: string): Promise<number> {
    const existFreePost = await this.findOne(freePostId);

    if (!existFreePost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

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

  incrementHit(freePostId: string): Promise<void> {
    return this.commonPostsService.incrementHit(freePostId);
  }

  async createReaction(
    userId: string,
    freePostId: string,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(freePostId);

    return this.reactionsService.create(
      createReactionDto.type,
      userId,
      freePostId,
    );
  }

  async findAllAndCountReactions(
    freePostId: string,
    findFreePostReactionListQueryDto: FindFreePostReactionListQueryDto,
  ): Promise<[FreePostReaction[], number]> {
    const { page, pageSize, order, type, ...filter } =
      findFreePostReactionListQueryDto;

    await this.isExistOrNotFound(freePostId);

    const where = this.queryHelper.buildWherePropForFind(filter);

    return this.reactionsService.findAllAndCount({
      where: { ...where, parentId: freePostId, reactionType: { name: type } },
      skip: page * pageSize,
      take: pageSize,
      order,
      relations: {
        reactionType: true,
      },
    });
  }

  async removeReaction(
    userId: string,
    freePostId: string,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(freePostId);

    return this.reactionsService.remove(
      removeReactionDto.type,
      userId,
      freePostId,
    );
  }

  async isExistOrNotFound(postId: string): Promise<true> {
    const isExistPost = await this.freePostRepository.exist({
      where: {
        id: postId,
      },
    });

    if (!isExistPost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return isExistPost;
  }

  async bulkAppendTagLink(
    userId: string,
    postId: string,
    postTags: PostTagDto[],
  ) {
    const existTagLinks = await this.freePostTagLinkRepository.findBy({
      freePostId: postId,
    });

    const newAppendTags = differenceWith(
      postTags,
      existTagLinks,
      (postTag, postTagLink) => postTag.id === postTagLink.postTagId,
    ).map((postTag) =>
      this.freePostTagLinkRepository.create({
        id: getTsid().toBigInt().toString(),
        userId,
        freePostId: postId,
        postTagId: postTag.id,
      }),
    );

    await this.freePostTagLinkRepository.insert(newAppendTags);

    return newAppendTags;
  }

  private async findPostTags(freePostId: string): Promise<PostTagDto[]> {
    const postTagLinks = await this.freePostTagLinkRepository.find({
      where: {
        freePostId,
      },
      relations: {
        postTag: true,
      },
    });

    return postTagLinks.map(
      (postTagLink) => new PostTagDto(postTagLink.postTag),
    );
  }
}
