import { Injectable } from '@nestjs/common';

import { FindOneOptions, IsNull } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ClubPostCommentStatus } from '@src/apis/club-post-comments/constants/club-post-comment.enum';
import { ClubPostCommentDto } from '@src/apis/club-post-comments/dto/club-post-comment.dto';
import { ClubPostCommentsItemDto } from '@src/apis/club-post-comments/dto/club-post-comments-item.dto';
import { FindAndCountClubPostCommentsDto } from '@src/apis/club-post-comments/dto/find-and-count-club-post-comments.dto';
import { FindClubPostCommentsDto } from '@src/apis/club-post-comments/dto/find-club-post-comments.dto';
import { PatchUpdateClubPostCommentDto } from '@src/apis/club-post-comments/dto/patch-update-club-post-comment.dto';
import { RemoveClubPostCommentDto } from '@src/apis/club-post-comments/dto/remove-club-post-comment.dto';
import { ClubPostCommentRepository } from '@src/apis/club-post-comments/repositories/club-post-comment.repository';
import { ClubPostsService } from '@src/apis/club-posts/services/club-posts.service';
import { CreateClubPostCommentRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-comment-request-body.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ClubPostComment } from '@src/entities/ClubPostComment';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
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

  async findAllAndCount(
    findAndCountClubPostCommentsDto: FindAndCountClubPostCommentsDto,
  ): Promise<[ClubPostComment[], number]> {
    const { page, pageSize, order, loadDepth, ...filter } =
      findAndCountClubPostCommentsDto;

    const where = this.queryHelper.buildWherePropForFind(filter);

    const relations = this.queryHelper.createNestedChildRelations(loadDepth);

    /**
     * @todo 1 이상 depth도 처리되게 변경
     * @todo join 후 where 필터링이 아닌 join on 조건으로 필터링되게
     */
    const [comments, count] = await this.clubPostCommentRepository.findAndCount(
      {
        where: {
          ...where,
          depth: 0,
        },
        order,
        skip: page * pageSize,
        take: pageSize,
        relations: {
          ...relations,
          user: true,
        },
      },
    );

    const filteredComments = comments.map((comment) => {
      comment.children = comment.children.filter(
        (c) => c.status === ClubPostCommentStatus.Posting,
      );

      return comment;
    });

    return [filteredComments, count];
  }

  async findOneOrNotFound(
    postId: number,
    postCommentId: number,
    parentId?: number | null,
    overrideOptions: FindOneOptions<ClubPostComment> = {},
  ): Promise<ClubPostCommentDto> {
    const existComment = await this.clubPostCommentRepository.findOne({
      where: {
        id: postCommentId,
        clubPostId: postId,
        parentId: parentId === null ? IsNull() : parentId,
        status: ClubPostCommentStatus.Posting,
      },
      relations: {
        user: true,
      },
      ...overrideOptions,
    });

    if (!existComment) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new ClubPostCommentDto(existComment);
  }

  @Transactional()
  async patchUpdate(
    patchUpdateClubPostCommentDto: PatchUpdateClubPostCommentDto,
  ) {
    const { clubPostId, id, parentId, userId } = patchUpdateClubPostCommentDto;

    const oldComment = await this.findOneOrNotFound(
      clubPostId,
      id,
      parentId === undefined ? null : parentId,
    );

    if (userId !== oldComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const newComment = this.clubPostCommentRepository.create({
      ...oldComment,
      ...patchUpdateClubPostCommentDto,
    });

    await this.clubPostCommentRepository.update(
      {
        id,
      },
      {
        ...newComment,
        updatedAt: new Date(),
      },
    );

    return new ClubPostCommentDto(newComment);
  }

  async remove(
    removeClubPostCommentDto: RemoveClubPostCommentDto,
  ): Promise<number> {
    const { id, clubPostId, userId } = removeClubPostCommentDto;

    const existComment = await this.findOneOrNotFound(clubPostId, id);

    if (userId !== existComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const updateResult = await this.clubPostCommentRepository.update(
      { id },
      {
        ...existComment,
        updatedAt: new Date(),
        status: ClubPostCommentStatus.Remove,
        deletedAt: new Date(),
      },
    );

    return updateResult.affected;
  }
}
