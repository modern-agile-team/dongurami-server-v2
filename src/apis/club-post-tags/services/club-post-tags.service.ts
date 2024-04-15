import { Injectable } from '@nestjs/common';

import { ClubPostTagRepository } from '@src/apis/club-post-tags/repositories/club-post-tag.repository';

@Injectable()
export class ClubPostTagsService {
  constructor(private readonly clubPostTagRepository: ClubPostTagRepository) {}
}
