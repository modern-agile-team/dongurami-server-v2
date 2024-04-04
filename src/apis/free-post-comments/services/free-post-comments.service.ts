import { Injectable } from '@nestjs/common';

import { IsNull } from 'typeorm';
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
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
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

    if (createFreePostCommentDto.parentId !== undefined) {
      const parentComment = await this.findOneOrNotFound(
        freePostId,
        createFreePostCommentDto.parentId,
        null,
      );

      createFreePostCommentDto.depth = parentComment.depth + 1;
    }

    if (createFreePostCommentDto.depth > 1) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 댓글 생성 중 depth가 2 이상인 경우가 생김',
      });
    }

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

    const { page, pageSize, order, loadDepth, ...filter } =
      findFreePostCommentListQueryDto;

    const where = this.queryHelper.buildWherePropForFind<FreePostComment>({
      ...filter,
      freePostId: existPost.id,
    });

    const relations = this.queryHelper.createNestedChildRelations(loadDepth);

    /**
     * @todo 1 이상 depth도 처리되게 변경
     * @todo join 후 where 필터링이 아닌 join on 조건으로 필터링되게
     */
    return this.freePostCommentRepository.findAndCount({
      where: {
        ...where,
        depth: 0,
        children: {
          status: FreePostCommentStatus.Posting,
        },
      },
      order,
      skip: page * pageSize,
      take: pageSize,
      relations: {
        ...relations,
        user: true,
      },
    });
  }

  async findOneOrNotFound(
    freePostId: number,
    freePostCommentId: number,
    parentId?: number | null,
  ): Promise<FreePostCommentDto> {
    const existComment = await this.freePostCommentRepository.findOne({
      where: {
        id: freePostCommentId,
        freePostId,
        parentId: parentId === null ? IsNull() : parentId,
        status: FreePostCommentStatus.Posting,
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
      putUpdateFreePostCommentDto.parentId === undefined
        ? null
        : putUpdateFreePostCommentDto.parentId,
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
