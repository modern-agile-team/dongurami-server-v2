import { Injectable } from '@nestjs/common';

import { AttachmentsService } from '@src/apis/attachments/services/attachments.service';
import { CreateClubPostAttachmentDto } from '@src/apis/club-post-attachments/dto/create-club-post-attachment.dto';
import { ClubPostAttachmentsService } from '@src/apis/club-post-attachments/services/club-post-attachments.service';
import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { CreateClubPostDto } from '@src/apis/club-posts/dto/create-club-post.dto';
import { ClubPostRepository } from '@src/apis/club-posts/repositories/club-post.repository';

@Injectable()
export class ClubPostsService {
  constructor(
    private readonly clubPostRepository: ClubPostRepository,
    private readonly attachmentsService: AttachmentsService,
    private readonly clubPostAttachmentsService: ClubPostAttachmentsService,
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
}
