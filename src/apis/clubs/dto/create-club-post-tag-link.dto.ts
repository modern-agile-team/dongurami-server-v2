export class CreateClubPostTagLinkDto {
  userId: number;
  clubPostId: number;
  postTagId: number;

  constructor(
    createClubPostTagLinkDto: Partial<CreateClubPostTagLinkDto> = {},
  ) {
    Object.assign(this, createClubPostTagLinkDto);
  }
}
