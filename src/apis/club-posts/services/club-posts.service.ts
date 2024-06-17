import { Injectable } from '@nestjs/common';

import { FindOneOptions } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { AttachmentDto } from '@src/apis/attachments/dto/attachment.dto';
import { AttachmentsService } from '@src/apis/attachments/services/attachments.service';
import { CreateClubPostAttachmentDto } from '@src/apis/club-post-attachments/dto/create-club-post-attachment.dto';
import { ClubPostAttachmentsService } from '@src/apis/club-post-attachments/services/club-post-attachments.service';
import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { ClubPostsItemDto } from '@src/apis/club-posts/dto/club-posts-item.dto';
import { CreateClubPostDto } from '@src/apis/club-posts/dto/create-club-post.dto';
import { FindClubPostListQueryDto } from '@src/apis/club-posts/dto/find-club-post-list-query.dto';
import { PatchUpdateClubPostDto } from '@src/apis/club-posts/dto/patch-update-club-post.dto';
import { ClubPostRepository } from '@src/apis/club-posts/repositories/club-post.repository';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { destructureExcludeKeys, isNil } from '@src/common/common';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ClubPost } from '@src/entities/ClubPost';
import { ClubPostReaction } from '@src/entities/ClubPostReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
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

    const filteredAttachments =
      await this.filterValidPostAttachments(attachmentPaths);

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
  ): Promise<
    [Omit<ClubPostsItemDto, 'clubPostComments' | 'commentCount'>[], number]
  > {
    const { page, pageSize, order, ...filter } = findClubPostListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    const aliasedOrder = this.queryHelper.aliasFactory('clubPost', order);

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
        .where(where)
        .orderBy(aliasedOrder)
        .groupBy('clubPost.id, clubPostAttachments.id')
        .skip(page * pageSize)
        .take(pageSize)
        .getManyWithVirtualColumns('clubPost'),

      this.clubPostRepository.countBy(where),
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

  async findOneOrNotFound(
    clubId: number,
    postId: number,
    overrideOptions?: FindOneOptions<ClubPost>,
  ): Promise<ClubPostDto> {
    const existPost = await this.clubPostRepository.findOne({
      where: { id: postId, clubId, status: ClubPostStatus.Posting },
      relations: { user: true },
      ...overrideOptions,
    });

    if (isNil(existPost)) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new ClubPostDto(existPost);
  }

  async isExistOrNotFound(clubId: number, postId: number): Promise<true> {
    const isExistClubPost = await this.clubPostRepository.exist({
      where: { id: postId, clubId, status: ClubPostStatus.Posting },
    });

    if (!isExistClubPost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return isExistClubPost;
  }

  @Transactional()
  async patchUpdate(
    patchUpdateClubPostDto: PatchUpdateClubPostDto,
  ): Promise<ClubPostDto> {
    const { userId, postId, clubId, attachmentPaths, ...postProps } =
      patchUpdateClubPostDto;

    const oldClubPost = destructureExcludeKeys(
      await this.findOneOrNotFound(clubId, postId),
      ['updatedAt'],
    );

    if (oldClubPost.userId !== userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    let attachments: AttachmentDto[];

    if (attachmentPaths) {
      await this.clubPostAttachmentsService.deleteByPostId(postId);

      const filteredAttachments =
        await this.filterValidPostAttachments(attachmentPaths);

      await this.clubPostAttachmentsService.bulkCreateClubPostAttachments(
        filteredAttachments.map(
          (filteredAttachment) =>
            new CreateClubPostAttachmentDto({
              attachmentId: filteredAttachment.id,
              clubPostId: postId,
            }),
        ),
      );

      attachments = filteredAttachments;
    } else {
      attachments = await this.findPostAttachments(postId);
    }

    const newClubPost = this.clubPostRepository.create({
      ...oldClubPost,
      ...postProps,
    });

    await this.clubPostRepository.update(
      {
        id: oldClubPost.id,
      },
      {
        ...newClubPost,
      },
    );

    return new ClubPostDto({
      ...newClubPost,
      attachments,
      updatedAt: new Date(),
    });
  }

  async createReaction(
    userId: number,
    clubId: number,
    postId: number,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(clubId, postId);

    return this.reactionsService.create(createReactionDto.type, userId, postId);
  }

  async removeReaction(
    userId: number,
    clubId: number,
    postId: number,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(clubId, postId);

    return this.reactionsService.remove(removeReactionDto.type, userId, postId);
  }

  private async filterValidPostAttachments(
    attachmentPaths: string[],
  ): Promise<AttachmentDto[]> {
    const existAttachments =
      await this.attachmentsService.findByPaths(attachmentPaths);

    return this.clubPostAttachmentsService.filterAttachments(existAttachments);
  }

  private async findPostAttachments(postId: number): Promise<AttachmentDto[]> {
    const clubPostAttachments =
      await this.clubPostAttachmentsService.findAll(postId);

    return clubPostAttachments.map(
      (clubPostAttachment) => new AttachmentDto(clubPostAttachment.attachment),
    );
  }
}
