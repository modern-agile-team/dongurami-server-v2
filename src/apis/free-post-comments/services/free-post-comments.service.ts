import { Injectable } from '@nestjs/common';

import { Transactional } from 'typeorm-transactional';

import { FreePostCommentStatus } from '@src/apis/free-post-comments/constants/free-post-comment.enum';
import { CreateFreePostCommentDto } from '@src/apis/free-post-comments/dto/create-free-post-comment.dto';
import { FindFreePostCommentListQueryDto } from '@src/apis/free-post-comments/dto/find-free-post-comment-list-query.dto';
import { FreePostCommentDto } from '@src/apis/free-post-comments/dto/free-post-comment.dto';
import { FreePostCommentsItemDto } from '@src/apis/free-post-comments/dto/free-post-comments-item.dto';
import { PutUpdateFreePostCommentDto } from '@src/apis/free-post-comments/dto/put-update-free-post-comment.dto';
import { FreePostCommentRepository } from '@src/apis/free-post-comments/repositories/free-post-comment.repository';
import { FreePostsService } from '@src/apis/free-posts/services/free-posts.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { FreePostComment } from '@src/entities/FreePostComment';
import { FreePostCommentReaction } from '@src/entities/FreePostCommentReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class FreePostCommentsService {
  constructor(
    private readonly freePostsService: FreePostsService,
    private readonly reactionsService: ReactionsService<FreePostCommentReaction>,

    private readonly queryHelper: QueryHelper,

    private readonly freePostCommentRepository: FreePostCommentRepository,
  ) {}

  @Transactional()
  async create(
    userId: number,
    freePostId: number,
    createFreePostCommentDto: CreateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    const existPost = await this.freePostsService.findOneOrNotFound(freePostId);

    const newPostComment = await this.freePostCommentRepository.save({
      userId,
      status: FreePostCommentStatus.Posting,
      freePostId: existPost.id,
      ...createFreePostCommentDto,
    });

    return new FreePostCommentDto(newPostComment);
  }

  async findAllAndCount(
    freePostId: number,
    findFreePostCommentListQueryDto: FindFreePostCommentListQueryDto,
  ): Promise<[FreePostCommentsItemDto[], number]> {
    const existPost = await this.freePostsService.findOneOrNotFound(freePostId);

    const { page, pageSize, order, ...filter } =
      findFreePostCommentListQueryDto;

    const where = this.queryHelper.buildWherePropForFind<FreePostComment>({
      ...filter,
      freePostId: existPost.id,
    });

    return this.freePostCommentRepository.findAndCount({
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });
  }

  async findOneOrNotFound(
    freePostId: number,
    freePostCommentId: number,
  ): Promise<FreePostCommentDto> {
    const existComment = await this.freePostCommentRepository.findOne({
      where: {
        freePostId,
        id: freePostCommentId,
      },
    });

    if (!existComment) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new FreePostCommentDto(existComment);
  }

  @Transactional()
  async putUpdate(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    putUpdateFreePostCommentDto: PutUpdateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    const oldComment = await this.findOneOrNotFound(
      freePostId,
      freePostCommentId,
    );

    if (userId !== oldComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const newComment = this.freePostCommentRepository.create({
      ...oldComment,
      ...putUpdateFreePostCommentDto,
    });

    await this.freePostCommentRepository.update(
      {
        id: freePostCommentId,
      },
      {
        ...newComment,
      },
    );

    return new FreePostCommentDto(newComment);
  }

  @Transactional()
  async remove(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
  ): Promise<number> {
    const existComment = await this.findOneOrNotFound(
      freePostId,
      freePostCommentId,
    );

    if (userId !== existComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const freePostCommentUpdateResult =
      await this.freePostCommentRepository.update(
        {
          id: freePostCommentId,
        },
        {
          ...existComment,
          status: FreePostCommentStatus.Remove,
          deletedAt: new Date(),
        },
      );

    return freePostCommentUpdateResult.affected;
  }

  async createReaction(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    const existComment = await this.findOneOrNotFound(
      freePostId,
      freePostCommentId,
    );

    return this.reactionsService.create(
      createReactionDto.type,
      userId,
      existComment.id,
    );
  }

  async removeReaction(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    const existComment = await this.findOneOrNotFound(
      freePostId,
      freePostCommentId,
    );

    return this.reactionsService.remove(
      removeReactionDto.type,
      userId,
      existComment.id,
    );
  }
}
