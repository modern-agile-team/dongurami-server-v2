import { Injectable } from '@nestjs/common';
import { CreateNoticeBoardDto } from '../dto/create-notice-board.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeBoard } from '@src/entities/NoticeBoard';
import { NoticeBoardDto } from '../dto/notice-board.dto';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { QueryHelper } from '@src/helpers/query.helper';
import { FindNoticeBoardListQueryDto } from '../dto/find-notice-board-list-query.dto';
import { NoticeBoardsItemDto } from '../dto/notice-boards-item.dto';
import { NoticeBoardHistoryService } from '../notice-board-history/services/notice-board-history.service';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { PutUpdateNoticeBoardDto } from '../dto/put-update-notice-board.dto';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';

@Injectable()
export class NoticeBoardsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<
    NoticeBoardDto,
    'title'
  >)[] = ['title'];

  constructor(
    private readonly queryHelper: QueryHelper,
    private readonly noticeBoardHistoryService: NoticeBoardHistoryService,
    private readonly dataSource: DataSource,
    @InjectRepository(NoticeBoard)
    private readonly noticeBoardRepository: Repository<NoticeBoard>,
  ) {}
  async create(userId: number, createNoticeBoardDto: CreateNoticeBoardDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const newPost = await entityManager
        .withRepository(this.noticeBoardRepository)
        .save({
          userId,
          ...createNoticeBoardDto,
        });

      await this.noticeBoardHistoryService.create(
        entityManager,
        newPost.userId,
        newPost.id,
        {
          title: newPost.title,
          description: newPost.description,
          allowComment: newPost.allowComment,
        },
      );

      await queryRunner.commitTransaction();

      return new NoticeBoardDto(newPost);
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
    findNoticeBoardListQueryDto: FindNoticeBoardListQueryDto,
  ): Promise<[NoticeBoardsItemDto[], number]> {
    const { page, pageSize, order, ...filter } = findNoticeBoardListQueryDto;
    console.log(findNoticeBoardListQueryDto);

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    return this.noticeBoardRepository.findAndCount({
      select: {
        id: true,
        userId: true,
        title: true,
        hit: true,
        allowComment: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });
  }

  async findOneOrNotFound(noticeboardId: number): Promise<NoticeBoardDto> {
    const noticeBoard = await this.noticeBoardRepository.findOneBy({
      id: noticeboardId,
    });

    if (!noticeBoard) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new NoticeBoardDto(noticeBoard);
  }

  async putUpdate(
    noticeBoardId: number,
    userId: number,
    putUpdateNoticeBoardDto: PutUpdateNoticeBoardDto,
  ): Promise<NoticeBoardDto> {
    const existBoard = await this.noticeBoardRepository.findOne({
      select: { userId: true },
      where: { id: noticeBoardId },
    });

    if (!existBoard) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    if (existBoard.userId !== userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;
      await entityManager.withRepository(this.noticeBoardRepository).update(
        {
          id: noticeBoardId,
        },
        {
          ...putUpdateNoticeBoardDto,
        },
      );

      const newPost = await entityManager
        .withRepository(this.noticeBoardRepository)
        .findOneByOrFail({ id: noticeBoardId });

      await this.noticeBoardHistoryService.create(
        entityManager,
        userId,
        noticeBoardId,
        {
          title: newPost.title,
          description: newPost.description,
          allowComment: newPost.allowComment,
        },
      );

      await queryRunner.commitTransaction();

      return new NoticeBoardDto(newPost);
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
}
