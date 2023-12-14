import { Injectable } from '@nestjs/common';
import { FreePostCommentStatus } from '@src/apis/free-posts/constants/free-post-comment.enum';
import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { CreateFreePostCommentDto } from '@src/apis/free-posts/dto/create-free-post-comment.dto';
import { CreateFreePostReplyCommentDto } from '@src/apis/free-posts/dto/create-free-post-reply-comment.dto';
import { FindFreePostCommentListQueryDto } from '@src/apis/free-posts/dto/find-free-post-comment-list-query.dto';
import { FindFreePostListQueryDto } from '@src/apis/free-posts/dto/find-free-post-list-query.dto';
import { FindFreePostReplyCommentListQueryDto } from '@src/apis/free-posts/dto/find-free-post-reply-comment-list-query.dto';
import { FreePostCommentDto } from '@src/apis/free-posts/dto/free-post-comment.dto';
import { FreePostCommentsItemDto } from '@src/apis/free-posts/dto/free-post-comments-item.dto';
import { FreePostReplyCommentDto } from '@src/apis/free-posts/dto/free-post-reply-comment.dto';
import { FreePostReplyCommentsItemDto } from '@src/apis/free-posts/dto/free-post-reply-comments-item.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { FreePostsItemDto } from '@src/apis/free-posts/dto/free-posts-item.dto';
import { PatchUpdateFreePostDto } from '@src/apis/free-posts/dto/patch-update-free-post.dto.td';
import { PutUpdateFreePostCommentDto } from '@src/apis/free-posts/dto/put-update-free-post-comment.dto';
import { PutUpdateFreePostReplyCommentDto } from '@src/apis/free-posts/dto/put-update-free-post-reply-comment.dto';
import { PutUpdateFreePostDto } from '@src/apis/free-posts/dto/put-update-free-post.dto';
import { FreePostHistoryService } from '@src/apis/free-posts/free-post-history/services/free-post-history.service';
import { FreePostCommentRepository } from '@src/apis/free-posts/repositories/free-post-comment.repository';
import { FreePostReplyCommentRepository } from '@src/apis/free-posts/repositories/free-post-reply-comment.repository';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { HistoryAction } from '@src/constants/enum';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { FreePostComment } from '@src/entities/FreePostComment';
import { FreePostReplyComment } from '@src/entities/FreePostReplyComment';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { isNotEmptyObject } from 'class-validator';
import { DataSource } from 'typeorm';
import { FreePostReplyCommentStatus } from '../constants/free-post-reply-comment.enum';
import { CreateFreePostDto } from '../dto/create-free-post.dto';

@Injectable()
export class FreePostsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<
    FreePostDto,
    'title'
  >)[] = ['title'];

  constructor(
    private readonly freePostHistoryService: FreePostHistoryService,

    private readonly queryHelper: QueryHelper,

    private readonly dataSource: DataSource,
    private readonly freePostRepository: FreePostRepository,
    private readonly freePostCommentRepository: FreePostCommentRepository,
    private readonly freePostReplyCommentRepository: FreePostReplyCommentRepository,
  ) {}

  async create(userId: number, createFreePostDto: CreateFreePostDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const newPost = await entityManager
        .withRepository(this.freePostRepository)
        .save({
          userId,
          status: FreePostStatus.Posting,
          ...createFreePostDto,
        });

      await this.freePostHistoryService.create(
        entityManager,
        userId,
        newPost.id,
        HistoryAction.Insert,
        {
          ...newPost,
        },
      );

      await queryRunner.commitTransaction();

      return new FreePostDto(newPost);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 생성 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
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

  async putUpdate(
    userId: number,
    freePostId: number,
    putUpdateFreePostDto: PutUpdateFreePostDto,
  ): Promise<FreePostDto> {
    const existFreePost = await this.findOneOrNotFound(freePostId);

    if (userId !== existFreePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      await entityManager.withRepository(this.freePostRepository).update(
        {
          id: freePostId,
        },
        {
          ...putUpdateFreePostDto,
        },
      );

      const newPost = await entityManager
        .withRepository(this.freePostRepository)
        .findOneByOrFail({
          id: freePostId,
        });

      await this.freePostHistoryService.create(
        entityManager,
        userId,
        freePostId,
        HistoryAction.Update,
        {
          ...newPost,
        },
      );

      await queryRunner.commitTransaction();

      return new FreePostDto(newPost);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 생성 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

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

    const existFreePost = await this.findOneOrNotFound(freePostId);

    if (userId !== existFreePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      await entityManager.withRepository(this.freePostRepository).update(
        {
          id: freePostId,
        },
        {
          ...patchUpdateFreePostDto,
        },
      );

      const newPost = await entityManager
        .withRepository(this.freePostRepository)
        .findOneByOrFail({
          id: freePostId,
        });

      await this.freePostHistoryService.create(
        entityManager,
        userId,
        freePostId,
        HistoryAction.Update,
        {
          ...newPost,
        },
      );

      await queryRunner.commitTransaction();

      return new FreePostDto(newPost);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 patch 수정 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async remove(userId: number, freePostId: number): Promise<number> {
    const existFreePost = await this.findOneOrNotFound(freePostId);

    if (userId !== existFreePost.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const freePostUpdateResult = await entityManager
        .withRepository(this.freePostRepository)
        .update(
          {
            id: freePostId,
          },
          {
            status: FreePostStatus.Remove,
            deletedAt: new Date(),
          },
        );

      await this.freePostHistoryService.create(
        entityManager,
        userId,
        freePostId,
        HistoryAction.Delete,
        {
          ...existFreePost,
          status: FreePostStatus.Remove,
        },
      );

      await queryRunner.commitTransaction();

      return freePostUpdateResult.affected;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 삭제 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async createComment(
    userId: number,
    freePostId: number,
    createFreePostCommentDto: CreateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    await this.findOneOrNotFound(freePostId);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const newPostComment = await entityManager
        .withRepository(this.freePostCommentRepository)
        .save({
          userId,
          freePostId,
          ...createFreePostCommentDto,
        });

      await this.freePostHistoryService.createComment(
        entityManager,
        userId,
        freePostId,
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

  async findAllAndCountComment(
    freePostId: number,
    findFreePostCommentListQueryDto: FindFreePostCommentListQueryDto,
  ): Promise<[FreePostCommentsItemDto[], number]> {
    await this.findOneOrNotFound(freePostId);

    const { page, pageSize, order, ...filter } =
      findFreePostCommentListQueryDto;

    const where = this.queryHelper.buildWherePropForFind<FreePostComment>({
      ...filter,
      freePostId,
    });

    return this.freePostCommentRepository.findAndCount({
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });
  }

  async findOneOrNotFoundComment(
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

  async putUpdateComment(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    putUpdateFreePostCommentDto: PutUpdateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    const existComment = await this.findOneOrNotFoundComment(
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

      await this.freePostHistoryService.createComment(
        entityManager,
        userId,
        freePostId,
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
        ctx: '자유게시글 put 수정 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async removeComment(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
  ): Promise<number> {
    const existComment = await this.findOneOrNotFoundComment(
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

      const freePostUpdateResult = await entityManager
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

      await this.freePostHistoryService.createComment(
        entityManager,
        userId,
        freePostId,
        HistoryAction.Delete,
        {
          ...existComment,
          status: FreePostCommentStatus.Remove,
        },
      );

      await queryRunner.commitTransaction();

      return freePostUpdateResult.affected;
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

  async createReplyComment(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    createFreePostReplyCommentDto: CreateFreePostReplyCommentDto,
  ): Promise<FreePostReplyCommentDto> {
    await this.findOneOrNotFoundComment(freePostId, freePostCommentId);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const newPostReplyComment = await entityManager
        .withRepository(this.freePostReplyCommentRepository)
        .save({
          userId,
          freePostCommentId,
          ...createFreePostReplyCommentDto,
        });

      await this.freePostHistoryService.createReplyComment(
        entityManager,
        userId,
        freePostId,
        HistoryAction.Insert,
        newPostReplyComment,
      );

      await queryRunner.commitTransaction();

      return new FreePostReplyCommentDto(newPostReplyComment);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 대댓글 생성 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async findAllAndCountReplyComment(
    freePostId: number,
    freePostCommentId: number,
    findFreePostReplyCommentListQueryDto: FindFreePostReplyCommentListQueryDto,
  ): Promise<[FreePostReplyCommentsItemDto[], number]> {
    await this.findOneOrNotFoundComment(freePostId, freePostCommentId);

    const { page, pageSize, order, ...filter } =
      findFreePostReplyCommentListQueryDto;

    const where = this.queryHelper.buildWherePropForFind<FreePostReplyComment>({
      ...filter,
      freePostCommentId,
    });

    return this.freePostReplyCommentRepository.findAndCount({
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });
  }

  async findOneOrNotFoundReplyComment(
    freePostId: number,
    freePostCommentId: number,
    freePostReplyCommentId: number,
  ): Promise<FreePostReplyCommentDto> {
    await this.findOneOrNotFound(freePostId);

    const existReplyComment = await this.freePostReplyCommentRepository.findOne(
      {
        where: {
          freePostCommentId,
          id: freePostReplyCommentId,
          status: FreePostReplyCommentStatus.Posting,
        },
      },
    );

    if (!existReplyComment) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new FreePostReplyCommentDto(existReplyComment);
  }

  async putUpdateReplyComment(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    freePostReplyCommentId: number,
    putUpdateFreePostReplyCommentDto: PutUpdateFreePostReplyCommentDto,
  ): Promise<FreePostReplyCommentDto> {
    const existReplyComment = await this.findOneOrNotFoundReplyComment(
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
    );

    if (userId !== existReplyComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      await entityManager
        .withRepository(this.freePostReplyCommentRepository)
        .update(
          {
            id: freePostCommentId,
          },
          {
            ...putUpdateFreePostReplyCommentDto,
          },
        );

      const newReplyComment = {
        ...existReplyComment,
        ...putUpdateFreePostReplyCommentDto,
      };

      await this.freePostHistoryService.createReplyComment(
        entityManager,
        userId,
        freePostId,
        HistoryAction.Update,
        newReplyComment,
      );

      await queryRunner.commitTransaction();

      return new FreePostReplyCommentDto(newReplyComment);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 대댓글 put 수정 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async removeReplyComment(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    freePostReplyCommentId: number,
  ): Promise<number> {
    const existReplyComment = await this.findOneOrNotFoundReplyComment(
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
    );

    if (userId !== existReplyComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const freePostUpdateResult = await entityManager
        .withRepository(this.freePostReplyCommentRepository)
        .update(
          {
            id: freePostId,
          },
          {
            status: FreePostReplyCommentStatus.Remove,
            deletedAt: new Date(),
          },
        );

      await this.freePostHistoryService.createReplyComment(
        entityManager,
        userId,
        freePostId,
        HistoryAction.Delete,
        {
          ...existReplyComment,
          status: FreePostReplyCommentStatus.Remove,
        },
      );

      await queryRunner.commitTransaction();

      return freePostUpdateResult.affected;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '자유게시글 대댓글 삭제 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }
}
