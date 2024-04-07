import { ClubMemberDto } from '@src/apis/club-members/dto/club-member.dto';

export class ClubMemberItemDto extends ClubMemberDto {
  constructor(clubMemberItemDto: Partial<ClubMemberItemDto> = {}) {
    super();

    Object.assign(this, clubMemberItemDto);
  }
}
