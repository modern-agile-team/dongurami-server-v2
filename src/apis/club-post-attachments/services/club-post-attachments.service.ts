import { Injectable } from '@nestjs/common';

import { AttachmentDto } from '@src/apis/attachments/dto/attachment.dto';
import { CLUB_POST_ATTACHMENT_MIME_TYPE } from '@src/apis/club-post-attachments/constants/club-post-attachment.constant';
import { CreateClubPostAttachmentDto } from '@src/apis/club-post-attachments/dto/create-club-post-attachment.dto';
import { ClubPostAttachmentRepository } from '@src/apis/club-post-attachments/repositories/club-post-attachment.repository';
import { ClubPostAttachment } from '@src/entities/ClubPostAttachment';

@Injectable()
export class ClubPostAttachmentsService {
  constructor(
    private readonly clubPostAttachmentRepository: ClubPostAttachmentRepository,
  ) {}

  async bulkCreateClubPostAttachments(
    createClubPostAttachmentDto: CreateClubPostAttachmentDto[],
  ): Promise<ClubPostAttachment[]> {
    const clubPostAttachments = this.clubPostAttachmentRepository.create(
      createClubPostAttachmentDto,
    );

    await this.clubPostAttachmentRepository.save(clubPostAttachments);

    return clubPostAttachments;
  }

  /**
   * @todo 업로드 제한에 대한 기획이 확실히 나오면 더 많은 필터링 조건 추가
   * ex) 용량
   */
  filterAttachments(attachments: AttachmentDto[]) {
    return attachments.filter((attachment) =>
      CLUB_POST_ATTACHMENT_MIME_TYPE.includes(attachment.mimeType),
    );
  }
}
