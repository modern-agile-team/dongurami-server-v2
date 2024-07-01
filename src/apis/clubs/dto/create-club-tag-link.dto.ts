export class CreateClubTagLinkDto {
  userId: string;
  clubId: string;
  clubTagId: string;

  constructor(createClubTagLinkDto: Partial<CreateClubTagLinkDto> = {}) {
    Object.assign(this, createClubTagLinkDto);
  }
}
