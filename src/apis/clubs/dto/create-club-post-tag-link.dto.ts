export class CreateClubPostTagLinkDto {
  userId: string;
  clubPostId: string;
  postTagId: string;

  constructor(
    createClubPostTagLinkDto: Partial<CreateClubPostTagLinkDto> = {},
  ) {
    Object.assign(this, createClubPostTagLinkDto);
  }
}
