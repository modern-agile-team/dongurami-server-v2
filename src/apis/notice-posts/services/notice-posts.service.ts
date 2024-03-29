import { Injectable } from '@nestjs/common';
import { CreateNoticePostDto } from '../dto/create-notice-post.dto';
import { DataSource } from 'typeorm';
import { NoticePostDto } from '../dto/notice-post.dto';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { QueryHelper } from '@src/helpers/query.helper';
import { FindNoticePostListQueryDto } from '../dto/find-notice-post-list-query.dto';
import { NoticePostsItemDto } from '../dto/notice-posts-item.dto';
import { NoticePostHistoryService } from '../notice-post-history/services/notice-posts-history.service';
import { HistoryAction } from '@src/constants/enum';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { NoticePostStatus } from '../constants/notice-post.enum';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { PutUpdateNoticePostDto } from '../dto/put-update-notice-post.dto';
import { PatchUpdateNoticePostDto } from '../dto/patch-update-notice-post.dto';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { NoticePostRepository } from '../repositories/notice-post.repository';
import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';
import { NoticePost } from '@src/entities/NoticePost';

@Injectable()
export class NoticePostsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<
    NoticePostDto,
    'title'
  >)[] = ['title'];

  constructor(
    private readonly queryHelper: QueryHelper,
    private readonly noticePostHistoryService: NoticePostHistoryService,
    private readonly dataSource: DataSource,
    private readonly noticePostRepository: NoticePostRepository,
    private readonly commonPostsService: CommonPostsService<NoticePost>,
  ) {}

  async create(userId: number, createNoticePostDto: CreateNoticePostDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const newPost = await entityManager
        .withRepository(this.noticePostRepository)
        .save({
          userId,
          ...createNoticePostDto,
        });

      await this.noticePostHistoryService.create(
        entityManager,
        newPost.userId,
        newPost.id,
        HistoryAction.Insert,
        {
          ...newPost,
        },
      );

      await queryRunner.commitTransaction();

      return new NoticePostDto(newPost);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '공지게시글 생성 중 알 수 없는 에러',
        stack: error.stack,
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async findAllAndCount(
    findNoticePostListQueryDto: FindNoticePostListQueryDto,
  ): Promise<[NoticePostsItemDto[], number]> {
    const { page, pageSize, order, ...filter } = findNoticePostListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    return this.noticePostRepository.findAndCount({
      select: {
        id: true,
        userId: true,
        title: true,
        hit: true,
        isAllowComment: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });
  }

  async findOneOrNotFound(noticePostId: number): Promise<NoticePostDto> {
    const noticePost = await this.noticePostRepository.findOneBy({
      id: noticePostId,
      status: NoticePostStatus.Posting,
    });

    if (!noticePost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new NoticePostDto(noticePost);
  }

  async putUpdate(
    noticePostId: number,
    userId: number,
    putUpdateNoticePostDto: PutUpdateNoticePostDto,
  ): Promise<NoticePostDto> {
    const existPost = await this.noticePostRepository.findOne({
      select: { userId: true },
      where: { id: noticePostId },
    });

    if (!existPost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    if (existPost.userId !== userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;
      await entityManager.withRepository(this.noticePostRepository).update(
        {
          id: noticePostId,
        },
        {
          ...putUpdateNoticePostDto,
        },
      );

      const newPost = await entityManager
        .withRepository(this.noticePostRepository)
        .findOneByOrFail({ id: noticePostId });

      await this.noticePostHistoryService.create(
        entityManager,
        userId,
        noticePostId,
        HistoryAction.Insert,
        {
          ...newPost,
        },
      );

      await queryRunner.commitTransaction();

      return new NoticePostDto(newPost);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        queryRunner.rollbackTransaction();
      }

      console.error(error);
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        stack: error.stack,
        ctx: '공지게시글 업데이트 중 알 수 없는 에러',
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async patchUpdate(
    noticePostId: number,
    userId: number,
    patchUpdateNoticePostDto: PatchUpdateNoticePostDto,
  ): Promise<NoticePostDto> {
    if (!Object.values(patchUpdateNoticePostDto).length) {
      throw new HttpBadRequestException({
        code: COMMON_ERROR_CODE.MISSING_UPDATE_FIELD,
      });
    }

    const existPost = await this.findOneOrNotFound(noticePostId);

    if (existPost.userId !== userId) {
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
        .withRepository(this.noticePostRepository)
        .update(
          { id: noticePostId, status: NoticePostStatus.Posting },
          { ...patchUpdateNoticePostDto },
        );

      const updatedBoard = await entityManager
        .withRepository(this.noticePostRepository)
        .findOneOrFail({ where: { id: noticePostId } });

      await this.noticePostHistoryService.create(
        entityManager,
        userId,
        noticePostId,
        HistoryAction.Update,
        { ...updatedBoard },
      );

      await queryRunner.commitTransaction();

      return new NoticePostDto(updatedBoard);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        stack: error.stack,
        ctx: '공지게시글 업데이트 중 알 수 없는 에러 발생',
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async remove(userId: number, noticePostId: number): Promise<number> {
    const existPost = await this.findOneOrNotFound(noticePostId);

    if (existPost.userId !== userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const updateResult = await entityManager
        .withRepository(this.noticePostRepository)
        .update({ id: noticePostId }, { status: NoticePostStatus.Remove });

      await this.noticePostHistoryService.create(
        entityManager,
        userId,
        noticePostId,
        HistoryAction.Delete,
        {
          ...existPost,
          status: NoticePostStatus.Remove,
        },
      );

      await queryRunner.commitTransaction();

      return updateResult.affected;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        stack: error.stack,
        ctx: '공지게시글 업데이트 중 알 수 없는 에러 발생',
      });
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  async increaseHit(noticePostId: number): Promise<void> {
    return this.commonPostsService.incrementHit(noticePostId);
  }
}
