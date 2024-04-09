export class CreateClubTagLinkDto {
  userId: number;
  clubId: number;
  clubTagId: number;

  constructor(createClubTagLinkDto: Partial<CreateClubTagLinkDto> = {}) {
    Object.assign(this, createClubTagLinkDto);
  }
}
