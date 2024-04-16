import { ClubPostTagDto } from '@src/apis/club-post-tags/dto/club-post-tag.dto';

export class CreateClubPostTagDto implements Pick<ClubPostTagDto, 'name'> {
  name: string;

  constructor(createClubPostTagDto: Partial<CreateClubPostTagDto> = {}) {
    Object.assign(this, createClubPostTagDto);
  }
}
