import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreeBoardStatus } from '@src/apis/free-boards/constants/free-board.enum';
import { FindFreeBoardListQueryDto } from '@src/apis/free-boards/dto/find-free-board-list-query.dto';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { FreeBoardsItemDto } from '@src/apis/free-boards/dto/free-boards-item.dto';
import { PatchUpdateFreeBoardDto } from '@src/apis/free-boards/dto/patch-update-free-board.dto.td';
import { PutUpdateFreeBoardDto } from '@src/apis/free-boards/dto/put-update-free-board.dto';
import { FreeBoardHistoryService } from '@src/apis/free-boards/free-board-history/services/free-board-history.service';
import { HistoryAction } from '@src/constants/enum';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { FreePost } from '@src/entities/FreePost';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { isNotEmptyObject } from 'class-validator';
import { DataSource, Repository } from 'typeorm';
import { CreateFreeBoardDto } from '../dto/create-free-board.dto';

@Injectable()
export class FreeBoardsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<
    FreeBoardDto,
    'title'
  >)[] = ['title'];

  constructor(
    private readonly freeBoardHistoryService: FreeBoardHistoryService,

    private readonly queryHelper: QueryHelper,

    private readonly dataSource: DataSource,
    @InjectRepository(FreePost)
    private readonly freeBoardRepository: Repository<FreePost>,
  ) {}

  async create(userId: number, createFreeBoardDto: CreateFreeBoardDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const newPost = await entityManager
        .withRepository(this.freeBoardRepository)
        .save({
          userId,
          status: FreeBoardStatus.Posting,
          ...createFreeBoardDto,
        });

      await this.freeBoardHistoryService.create(
        entityManager,
        userId,
        newPost.id,
        HistoryAction.Insert,
        {
          ...newPost,
        },
      );

      await queryRunner.commitTransaction();

      return new FreeBoardDto(newPost);
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
    findFreeBoardListQueryDto: FindFreeBoardListQueryDto,
  ): Promise<[FreeBoardsItemDto[], number]> {
    const { page, pageSize, order, ...filter } = findFreeBoardListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    return this.freeBoardRepository.findAndCount({
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

  async findOneOrNotFound(freeBoardId: number): Promise<FreeBoardDto> {
    const freeBoard = await this.freeBoardRepository.findOneBy({
      id: freeBoardId,
      status: FreeBoardStatus.Posting,
    });

    if (!freeBoard) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new FreeBoardDto(freeBoard);
  }

  async putUpdate(
    userId: number,
    freeBoardId: number,
    putUpdateFreeBoardDto: PutUpdateFreeBoardDto,
  ): Promise<FreeBoardDto> {
    const existFreeBoard = await this.findOneOrNotFound(freeBoardId);

    if (userId !== existFreeBoard.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      await entityManager.withRepository(this.freeBoardRepository).update(
        {
          id: freeBoardId,
        },
        {
          ...putUpdateFreeBoardDto,
        },
      );

      const newPost = await entityManager
        .withRepository(this.freeBoardRepository)
        .findOneByOrFail({
          id: freeBoardId,
        });

      await this.freeBoardHistoryService.create(
        entityManager,
        userId,
        freeBoardId,
        HistoryAction.Update,
        {
          ...newPost,
        },
      );

      await queryRunner.commitTransaction();

      return new FreeBoardDto(newPost);
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
    freeBoardId: number,
    patchUpdateFreeBoardDto: PatchUpdateFreeBoardDto,
  ): Promise<FreeBoardDto> {
    if (!isNotEmptyObject(patchUpdateFreeBoardDto)) {
      throw new HttpBadRequestException({
        code: ERROR_CODE.MISSING_UPDATE_FIELD,
      });
    }

    const existFreeBoard = await this.findOneOrNotFound(freeBoardId);

    if (userId !== existFreeBoard.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      await entityManager.withRepository(this.freeBoardRepository).update(
        {
          id: freeBoardId,
        },
        {
          ...patchUpdateFreeBoardDto,
        },
      );

      const newPost = await entityManager
        .withRepository(this.freeBoardRepository)
        .findOneByOrFail({
          id: freeBoardId,
        });

      await this.freeBoardHistoryService.create(
        entityManager,
        userId,
        freeBoardId,
        HistoryAction.Update,
        {
          ...newPost,
        },
      );

      await queryRunner.commitTransaction();

      return new FreeBoardDto(newPost);
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
  async remove(userId: number, freeBoardId: number): Promise<number> {
    const existFreeBoard = await this.findOneOrNotFound(freeBoardId);

    if (userId !== existFreeBoard.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const freeBoardDeleteResult = await entityManager
        .withRepository(this.freeBoardRepository)
        .update(
          {
            id: freeBoardId,
          },
          {
            status: FreeBoardStatus.Remove,
            deletedAt: new Date(),
          },
        );

      await this.freeBoardHistoryService.create(
        entityManager,
        userId,
        freeBoardId,
        HistoryAction.Delete,
        {
          ...existFreeBoard,
          status: FreeBoardStatus.Remove,
        },
      );

      await queryRunner.commitTransaction();

      return freeBoardDeleteResult.affected;
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
