import { Injectable } from '@nestjs/common';
import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { FindFreePostListQueryDto } from '@src/apis/free-posts/dto/find-free-post-list-query.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { FreePostsItemDto } from '@src/apis/free-posts/dto/free-posts-item.dto';
import { PatchUpdateFreePostDto } from '@src/apis/free-posts/dto/patch-update-free-post.dto.td';
import { PutUpdateFreePostDto } from '@src/apis/free-posts/dto/put-update-free-post.dto';
import { FreePostHistoryService } from '@src/apis/free-posts/free-post-history/services/free-post-history.service';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { HistoryAction } from '@src/constants/enum';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { isNotEmptyObject } from 'class-validator';
import { DataSource } from 'typeorm';
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

  /**
   * 테이블 참조 때문에 삭제 불가 개선 예정
   */
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
}
