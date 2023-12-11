import { Injectable } from '@nestjs/common';
import { CreateFreePostCommentDto } from '@src/apis/free-posts/free-post-comments/dto/create-free-post-comment.dto';
import { FindFreePostCommentListQueryDto } from '@src/apis/free-posts/free-post-comments/dto/find-free-post-comment-list-query.dto';
import { FreePostCommentDto } from '@src/apis/free-posts/free-post-comments/dto/free-post-comment.dto';
import { FreePostCommentsItemDto } from '@src/apis/free-posts/free-post-comments/dto/free-post-comments-item.dto';
import { PutUpdateFreePostCommentDto } from '@src/apis/free-posts/free-post-comments/dto/put-update-free-post-comment.dto';
import { FreePostCommentHistoryRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-comment-history.repository';
import { FreePostCommentRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-comment.repository';

@Injectable()
export class FreePostCommentsService {
  constructor(
    private readonly freePostCommentRepository: FreePostCommentRepository,
    private readonly freePostCommentHistoryRepository: FreePostCommentHistoryRepository,
  ) {}

  async create(
    userId: number,
    freePostId: number,
    createFreePostCommentDto: CreateFreePostCommentDto,
  ): Promise<FreePostCommentDto> {
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
