import { Injectable } from '@nestjs/common';
import { CreateFreePostCommentDto } from '@src/apis/free-posts/free-post-comments/dto/create-free-post-comment.dto';
import { FindFreePostCommentListQueryDto } from '@src/apis/free-posts/free-post-comments/dto/find-free-post-comment-list-query.dto';
import { FreePostCommentDto } from '@src/apis/free-posts/free-post-comments/dto/free-post-comment.dto';
import { FreePostCommentsItemDto } from '@src/apis/free-posts/free-post-comments/dto/free-post-comments-item.dto';
import { PutUpdateFreePostCommentDto } from '@src/apis/free-posts/free-post-comments/dto/put-update-free-post-comment.dto';
import { FreePostCommentHistoryRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-comment-history.repository';
import { FreePostCommentRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-comment.repository';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { DataSource } from 'typeorm';

@Injectable()
export class FreePostCommentsService {
  constructor(
    private readonly freePostCommentRepository: FreePostCommentRepository,
    private readonly freePostCommentHistoryRepository: FreePostCommentHistoryRepository,

    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: number,
    freePostId: number,
    createFreePostCommentDto: CreateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    const queryRunner = this.dataSource.createQueryRunner();

    const a = this.freePostCommentRepository.findOne({
      select: {
        freePost: {
          id: true,
        },
      },
      where: {},
    });

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

    return new FreePostCommentDto();
  }

  async findAllAndCount(
    findFreePostCommentListQueryDto: FindFreePostCommentListQueryDto,
  ): Promise<[FreePostCommentsItemDto[], number]> {
    return [[], 1];
  }

  async putUpdate(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    putUpdateFreePostCommentDto: PutUpdateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
    return new FreePostCommentDto();
  }

  async remove(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
  ): Promise<number> {
    return 1;
  }
}
