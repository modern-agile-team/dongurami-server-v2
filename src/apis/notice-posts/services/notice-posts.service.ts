import { Injectable } from '@nestjs/common';
import { CreateNoticeBoardDto } from '../dto/create-notice-post.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeBoard } from '@src/entities/NoticePost';
import { NoticeBoardDto } from '../dto/notice-post.dto';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { QueryHelper } from '@src/helpers/query.helper';
import { FindNoticeBoardListQueryDto } from '../dto/find-notice-post-list-query.dto';
import { NoticeBoardsItemDto } from '../dto/notice-posts-item.dto';
import { NoticeBoardHistoryService } from '../notice-post-history/services/notice-posts-history.service';
import { HistoryAction } from '@src/constants/enum';

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
      console.log(newPost);

      await this.noticeBoardHistoryService.create(
        entityManager,
        newPost.userId,
        newPost.id,
        HistoryAction.Insert,
        {
          ...newPost,
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
}
