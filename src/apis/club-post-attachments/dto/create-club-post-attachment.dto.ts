import { ClubPostAttachment } from '@src/entities/ClubPostAttachment';

export class CreateClubPostAttachmentDto
  implements Pick<ClubPostAttachment, 'clubPostId' | 'attachmentId'>
{
  clubPostId: number;
  attachmentId: string;

  constructor(
    createClubPostAttachmentDto: Partial<CreateClubPostAttachmentDto> = {},
  ) {
    this.attachmentId = createClubPostAttachmentDto.attachmentId;
    this.clubPostId = createClubPostAttachmentDto.clubPostId;
  }
}
