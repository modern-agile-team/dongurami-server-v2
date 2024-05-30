import { Injectable } from '@nestjs/common';

import { AttachmentsService } from '@src/apis/attachments/services/attachments.service';
import { CreateClubPostAttachmentDto } from '@src/apis/club-post-attachments/dto/create-club-post-attachment.dto';
import { ClubPostAttachmentsService } from '@src/apis/club-post-attachments/services/club-post-attachments.service';
import { ClubPostCommentStatus } from '@src/apis/club-post-comments/constants/club-post-comment.enum';
import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { ClubPostsItemDto } from '@src/apis/club-posts/dto/club-posts-item.dto';
import { CreateClubPostDto } from '@src/apis/club-posts/dto/create-club-post.dto';
import { FindClubPostListQueryDto } from '@src/apis/club-posts/dto/find-club-post-list-query.dto';
import { ClubPostRepository } from '@src/apis/club-posts/repositories/club-post.repository';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ClubPostReaction } from '@src/entities/ClubPostReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class ClubPostsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<
    ClubPostDto,
    'description'
  >)[] = ['description'];

  constructor(
    private readonly clubPostRepository: ClubPostRepository,
    private readonly attachmentsService: AttachmentsService,
    private readonly clubPostAttachmentsService: ClubPostAttachmentsService,
    private readonly queryHelper: QueryHelper,
    private readonly reactionsService: ReactionsService<ClubPostReaction>,
  ) {}

  async create(createClubPostDto: CreateClubPostDto): Promise<ClubPostDto> {
    const { attachmentPaths, ...createClubPostProps } = createClubPostDto;

    const existAttachments =
      await this.attachmentsService.findByPaths(attachmentPaths);

    const filteredAttachments =
      this.clubPostAttachmentsService.filterAttachments(existAttachments);

    const newClubPost = this.clubPostRepository.create({
      ...createClubPostProps,
      status: ClubPostStatus.Posting,
    });

    await this.clubPostRepository.save(newClubPost);

    await this.clubPostAttachmentsService.bulkCreateClubPostAttachments(
      filteredAttachments.map(
        (filteredAttachment) =>
          new CreateClubPostAttachmentDto({
            clubPostId: newClubPost.id,
            attachmentId: filteredAttachment.id,
          }),
      ),
    );

    return new ClubPostDto({
      ...newClubPost,
      attachments: filteredAttachments,
    });
  }

  async findAllAndCount(
    findClubPostListQueryDto: FindClubPostListQueryDto,
  ): Promise<[ClubPostsItemDto[], number]> {
    const { page, pageSize, order, ...filter } = findClubPostListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    this.queryHelper.aliasFactory('clubPost', order);

    const [clubPosts, count] = await Promise.all([
      this.clubPostRepository
        .createQueryBuilder('clubPost')
        .select([
          'clubPost.id',
          'clubPost.clubId',
          'clubPost.userId',
          'clubPost.description',
          'clubPost.tags',
          'clubPost.createdAt',
          'clubPost.updatedAt',
        ])
        .addSelect('COUNT(DISTINCT clubPostReactions.id)', 'likeCount')
        .addSelect('COUNT(DISTINCT clubPostComments.id)', 'commentCount')
        .innerJoinAndSelect(
          'clubPost.user',
          'user',
          'clubPost.userId = user.id',
        )
        .leftJoinAndSelect(
          'clubPost.clubPostAttachments',
          'clubPostAttachments',
          'clubPostAttachments.clubPostId = clubPost.id',
        )
        .leftJoinAndSelect(
          'clubPostAttachments.attachment',
          'attachment',
          'clubPostAttachments.attachmentId = attachment.id',
        )
        .leftJoin(
          'clubPost.clubPostReactions',
          'clubPostReactions',
          'clubPostReactions.parentId = clubPost.id',
        )
        .leftJoinAndSelect(
          'clubPost.clubPostComments',
          'clubPostComments',
          'clubPostComments.status = :status',
          { status: ClubPostCommentStatus.Posting },
        )
        .leftJoinAndSelect(
          'clubPostComments.user',
          'commentUser',
          'clubPostComments.userId = commentUser.id',
        )
        .where(where)
        .orderBy(order)
        .groupBy('clubPost.id, clubPostAttachments.id, clubPostComments.id')
        .skip(page * pageSize)
        .take(pageSize)
        .getManyWithVirtualColumns('clubPost'),

      this.clubPostRepository.countBy({ ...where }),
    ]);

    return [
      clubPosts.map((clubPost) => {
        const { clubPostAttachments, ...clubPostProps } = clubPost;
        return {
          ...clubPostProps,
          attachments: clubPostAttachments.map(
            (clubPostAttachment) => clubPostAttachment.attachment,
          ),
        };
      }),
      count,
    ];
  }

  async isExistOrNotFound(postId: number): Promise<true> {
    const isExistClubPost = await this.clubPostRepository.exist({
      where: { id: postId },
    });

    if (!isExistClubPost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return isExistClubPost;
  }

  async createReaction(
    userId: number,
    postId: number,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(postId);

    return this.reactionsService.create(createReactionDto.type, userId, postId);
  }

  async removeReaction(
    userId: number,
    postId: number,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(postId);

    return this.reactionsService.remove(removeReactionDto.type, userId, postId);
  }
}
