import { PickType } from '@nestjs/swagger';

import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';

export class CreateClubPostDto extends PickType(ClubPostDto, [
  'clubId',
  'userId',
  'description',
  'tags',
]) {
  attachmentPaths: string[];

  constructor(createClubPostDto: Partial<CreateClubPostDto> = {}) {
    const { clubId, userId, description, tags, attachmentPaths } =
      createClubPostDto;

    super();

    this.clubId = clubId;
    this.userId = userId;
    this.description = description;
    this.tags = tags;
    this.attachmentPaths = attachmentPaths;
  }
}
