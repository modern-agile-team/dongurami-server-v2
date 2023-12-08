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
import { NoticePostStatus } from '../constants/notice-Post.enum';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { PutUpdateNoticePostDto } from '../dto/put-update-notice-post.dto';
import { PatchUpdateNoticePostDto } from '../dto/patch-update-notice-post.dto';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { NoticePostRepository } from '../repositories/notice-post.repository';

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
      console.log(newPost);

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
  ) {
    if (!Object.values(patchUpdateNoticePostDto).length) {
      throw new HttpBadRequestException({
        code: COMMON_ERROR_CODE.MISSING_UPDATE_FIELD,
        errors: ['update filed is null'],
      });
    }

    const existPost = await this.findOneOrNotFound(noticePostId);

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

      const isUpdate = await this.noticePostRepository.update(
        { id: noticePostId },
        { ...patchUpdateNoticePostDto },
      );

      if (!isUpdate.affected) {
        throw new HttpInternalServerErrorException({
          code: COMMON_ERROR_CODE.SERVER_ERROR,
          ctx: '게시글 수정이 정상적으로 이루어지지 않았습니다.',
        });
      }

      const updatedPost = await this.findOneOrNotFound(noticePostId);

      await this.noticePostHistoryService.create(
        entityManager,
        userId,
        noticePostId,
        HistoryAction.Update,
        { ...updatedPost },
      );
    } catch (error) {
      if (!queryRunner.isTransactionActive) {
        queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        stack: error.stack,
        ctx: '게시글 업데이트 중 알 수 없는 에러 발생',
      });
    } finally {
      queryRunner.release();
    }
  }

  async remove(userId: number, noticePostId: number) {
    const existPost = await this.findOneOrNotFound(noticePostId);

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

      const isRemove = await this.noticePostRepository.update(
        { id: noticePostId },
        { status: NoticePostStatus.Remove },
      );

      if (!isRemove.affected) {
        throw new HttpInternalServerErrorException({
          code: COMMON_ERROR_CODE.SERVER_ERROR,
          ctx: '게시글 삭제 중 알 수 없는 에러 발생',
        });
      }

      await this.noticePostHistoryService.create(
        entityManager,
        userId,
        noticePostId,
        HistoryAction.Delete,
        { ...existPost },
      );

      return '게시글 삭제 완료';
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        queryRunner.rollbackTransaction();
      }

      console.error(error);

      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        stack: error.stack,
        ctx: '게시글 업데이트 중 알 수 없는 에러 발생',
      });
    } finally {
      queryRunner.release();
    }
  }
}
