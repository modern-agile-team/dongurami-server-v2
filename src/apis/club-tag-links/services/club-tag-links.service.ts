import { Injectable } from '@nestjs/common';

import { CreateClubTagLinkDto } from '@src/apis/club-tag-links/dto/create-club-tag-link.dto';
import { ClubTagLinkRepository } from '@src/apis/club-tag-links/repositories/club-tag-link.repository';

@Injectable()
export class ClubTagLinksService {
  constructor(private readonly clubTagLinksRepository: ClubTagLinkRepository) {}

  async create(createClubTagLinksDto: CreateClubTagLinkDto[]): Promise<void> {
    await this.clubTagLinksRepository.save(
      this.clubTagLinksRepository.create(createClubTagLinksDto),
      { reload: false },
    );
  }
}
