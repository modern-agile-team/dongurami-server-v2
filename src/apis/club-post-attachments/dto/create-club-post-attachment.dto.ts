import { ClubPostAttachment } from '@src/entities/ClubPostAttachment';

export class CreateClubPostAttachmentDto
  implements Pick<ClubPostAttachment, 'clubPostId' | 'attachmentPath'>
{
  clubPostId: number;
  attachmentPath: string;

  constructor(
    createClubPostAttachmentDto: Partial<CreateClubPostAttachmentDto> = {},
  ) {
    this.attachmentPath = createClubPostAttachmentDto.attachmentPath;
    this.clubPostId = createClubPostAttachmentDto.clubPostId;
  }
}
