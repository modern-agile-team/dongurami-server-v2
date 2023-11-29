import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { FreeBoard } from '@src/entities/FreeBoard';
import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { DataSource, Repository } from 'typeorm';
import { CreateFreeBoardDto } from '../dto/create-free-board.dto';

@Injectable()
export class FreeBoardsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(FreeBoard)
    private readonly freeBoardRepository: Repository<FreeBoard>,
    @InjectRepository(FreeBoardHistory)
    private readonly freeBoardHistoryRepository: Repository<FreeBoardHistory>,
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
          ...createFreeBoardDto,
        });

      await entityManager.withRepository(this.freeBoardHistoryRepository).save({
        userId,
        freeBoardId: newPost.id,
        title: newPost.title,
        description: newPost.description,
        isAnonymous: newPost.isAnonymous,
      });

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

  // findAll() {
  //   return `This action returns all freeBoard`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} freeBoard`;
  // }

  // update(id: number, updateFreeBoardDto: UpdateFreeBoardDto) {
  //   return `This action updates a #${id} freeBoard`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} freeBoard`;
  // }
}
