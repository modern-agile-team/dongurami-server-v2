import { Injectable } from '@nestjs/common';

import { AttachmentsService } from '@src/apis/attachments/services/attachments.service';
import { CreateClubPostAttachmentDto } from '@src/apis/club-post-attachments/dto/create-club-post-attachment.dto';
import { ClubPostAttachmentsService } from '@src/apis/club-post-attachments/services/club-post-attachments.service';
import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
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

  async findAllAndCount(findClubPostListQueryDto: FindClubPostListQueryDto) {
    const { page, pageSize, order, ...filter } = findClubPostListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    await this.clubPostRepository.findAndCount({
      where,
      skip: page,
      take: page * pageSize,
      order,
    });

    await this.clubPostRepository
      .createQueryBuilder('clubPost')
      .select([
        'id',
        'clubId',
        'userId',
        'description',
        'tags',
        'createdAt',
        'updatedAt',
        'clubPostAttachments',
        'COUNT(DISTINCT clubPostReactions.id) as likeCount',
      ])
      .leftJoinAndSelect('clubPost.clubPostAttachments', 'clubPostAttachments')
      .leftJoin('clubPost.clubPostReactions', 'clubPostReactions');
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
