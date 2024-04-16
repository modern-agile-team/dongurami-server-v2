export class CreateClubPostTagLinkDto {
  userId: number;
  clubPostId: number;
  clubPostTagId: number;

  constructor(
    createClubPostTagLinkDto: Partial<CreateClubPostTagLinkDto> = {},
  ) {
    Object.assign(this, createClubPostTagLinkDto);
  }
}
