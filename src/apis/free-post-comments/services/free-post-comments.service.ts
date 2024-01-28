import { Injectable } from '@nestjs/common';
import { FreePostCommentStatus } from '@src/apis/free-post-comments/constants/free-post-comment.enum';
import { CreateFreePostCommentDto } from '@src/apis/free-post-comments/dto/create-free-post-comment.dto';
import { FindFreePostCommentListQueryDto } from '@src/apis/free-post-comments/dto/find-free-post-comment-list-query.dto';
import { FreePostCommentDto } from '@src/apis/free-post-comments/dto/free-post-comment.dto';
import { FreePostCommentsItemDto } from '@src/apis/free-post-comments/dto/free-post-comments-item.dto';
import { PutUpdateFreePostCommentDto } from '@src/apis/free-post-comments/dto/put-update-free-post-comment.dto';
import { FreePostCommentHistoryService } from '@src/apis/free-post-comments/free-post-comment-history/services/free-post-comment-history.service';
import { FreePostCommentRepository } from '@src/apis/free-post-comments/repositories/free-post-comment.repository';
import { FreePostsService } from '@src/apis/free-posts/services/free-posts.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { HistoryAction } from '@src/constants/enum';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { FreePostComment } from '@src/entities/FreePostComment';
import { FreePostCommentReaction } from '@src/entities/FreePostCommentReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { DataSource } from 'typeorm';

@Injectable()
export class FreePostCommentsService {
  constructor(
    private readonly freePostsService: FreePostsService,
    private readonly freePostCommentHistoryService: FreePostCommentHistoryService,
    private readonly reactionsService: ReactionsService<FreePostCommentReaction>,

    private readonly queryHelper: QueryHelper,

    private readonly dataSource: DataSource,
    private readonly freePostCommentRepository: FreePostCommentRepository,
  ) {}

  async create(
    userId: number,
    freePostId: number,
    createFreePostCommentDto: CreateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    const existPost = await this.freePostsService.findOneOrNotFound(freePostId);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const newPostComment = await entityManager
        .withRepository(this.freePostCommentRepository)
        .save({
          userId,
          status: FreePostCommentStatus.Posting,
          freePostId: existPost.id,
          ...createFreePostCommentDto,
        });

      await this.freePostCommentHistoryService.create(
        entityManager,
        userId,
        existPost.id,
        newPostComment.id,
        HistoryAction.Insert,
        newPostComment,
      );

      await queryRunner.commitTransaction();

      return new FreePostCommentDto(newPostComment);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 댓글 생성 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
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

  async putUpdate(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    putUpdateFreePostCommentDto: PutUpdateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    const existComment = await this.findOneOrNotFound(
      freePostId,
      freePostCommentId,
    );

    if (userId !== existComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      await entityManager.withRepository(this.freePostCommentRepository).update(
        {
          id: freePostCommentId,
        },
        {
          ...putUpdateFreePostCommentDto,
        },
      );

      const newComment = {
        ...existComment,
        ...putUpdateFreePostCommentDto,
      };

      await this.freePostCommentHistoryService.create(
        entityManager,
        userId,
        freePostId,
        freePostCommentId,
        HistoryAction.Update,
        newComment,
      );

      await queryRunner.commitTransaction();

      return new FreePostCommentDto(newComment);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 댓글 put 수정 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  /**
   * @todo 댓글 삭제 시 soft delete 를 하기 떄문에 대댓글은 삭제되지 않음
   */
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

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const freePostCommentUpdateResult = await entityManager
        .withRepository(this.freePostCommentRepository)
        .update(
          {
            id: freePostId,
          },
          {
            status: FreePostCommentStatus.Remove,
            deletedAt: new Date(),
          },
        );

      await this.freePostCommentHistoryService.create(
        entityManager,
        userId,
        freePostId,
        freePostCommentId,
        HistoryAction.Delete,
        {
          ...existComment,
          status: FreePostCommentStatus.Remove,
        },
      );

      await queryRunner.commitTransaction();

      return freePostCommentUpdateResult.affected;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 댓글 삭제 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
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
