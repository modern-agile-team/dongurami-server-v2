import { Injectable } from '@nestjs/common';

import { CreateClubTagLinksDto } from '@src/apis/club-tag-links/dto/create-club-tag-links.dto';
import { ClubTagLinkRepository } from '@src/apis/club-tag-links/repositories/club-tag-link.repository';

@Injectable()
export class ClubTagLinksService {
  constructor(private readonly clubTagLinksRepository: ClubTagLinkRepository) {}

  async create(createClubTagLinksDto: CreateClubTagLinksDto[]): Promise<void> {
    await this.clubTagLinksRepository.save(
      this.clubTagLinksRepository.create(createClubTagLinksDto),
      { reload: false },
    );
  }
}
