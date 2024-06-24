import { Injectable } from '@nestjs/common';

import { IsNull } from 'typeorm';

import { ClubPostCommentStatus } from '@src/apis/club-post-comments/constants/club-post-comment.enum';
import { ClubPostCommentDto } from '@src/apis/club-post-comments/dto/club-post-comment.dto';
import { ClubPostCommentsItemDto } from '@src/apis/club-post-comments/dto/club-post-comments-item.dto';
import { FindClubPostCommentsDto } from '@src/apis/club-post-comments/dto/find-club-post-comments.dto';
import { ClubPostCommentRepository } from '@src/apis/club-post-comments/repositories/club-post-comment.repository';
import { ClubPostsService } from '@src/apis/club-posts/services/club-posts.service';
import { CreateClubPostCommentRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-comment-request-body.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class ClubPostCommentsService {
  constructor(
    private readonly clubPostCommentRepository: ClubPostCommentRepository,
    private readonly clubPostsService: ClubPostsService,
    private readonly queryHelper: QueryHelper,
  ) {}

  async create(
    userId: number,
    clubId: number,
    postId: number,
    createClubPostCommentRequestBodyDto: CreateClubPostCommentRequestBodyDto,
  ): Promise<ClubPostCommentDto> {
    await this.clubPostsService.isExistOrNotFound(clubId, postId);

    if (createClubPostCommentRequestBodyDto.parentId !== undefined) {
      const parentComment = await this.findOneOrNotFound(
        postId,
        createClubPostCommentRequestBodyDto.parentId,
        null,
      );

      createClubPostCommentRequestBodyDto.depth = parentComment.depth + 1;
    }

    if (createClubPostCommentRequestBodyDto.depth > 1) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '동아리 게시글 댓글 생성 중 depth가 2 이상인 경우가 생김',
      });
    }

    const newPostComment = this.clubPostCommentRepository.create({
      ...createClubPostCommentRequestBodyDto,
      userId,
      clubPostId: postId,
      status: ClubPostCommentStatus.Posting,
    });

    await this.clubPostCommentRepository.save(newPostComment);

    return new ClubPostCommentDto(newPostComment);
  }

  async findAll(
    findAllClubPostCommentsDto: FindClubPostCommentsDto,
  ): Promise<ClubPostCommentsItemDto[]> {
    const { order, ...filter } = findAllClubPostCommentsDto;

    const where = this.queryHelper.buildWherePropForFind(filter);

    return this.clubPostCommentRepository.find({
      where: {
        ...where,
        depth: 0,
      },
      relations: {
        user: true,
      },
      order,
    });
  }

  async findOneOrNotFound(
    postId: number,
    postCommentId: number,
    parentId?: number | null,
  ): Promise<ClubPostCommentDto> {
    const existComment = await this.clubPostCommentRepository.findOne({
      where: {
        id: postCommentId,
        clubPostId: postId,
        parentId: parentId === null ? IsNull() : parentId,
        status: ClubPostCommentStatus.Posting,
      },
    });

    if (!existComment) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new ClubPostCommentDto(existComment);
  }
}
