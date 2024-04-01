import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { In } from 'typeorm';

import { ClubTagLinkRepository } from '@src/apis/club-tag-links/repositories/club-tag-link.repository';
import { CreateClubTagDto } from '@src/apis/club-tags/dto/create-club-tag.dto';
import { ClubTagRepository } from '@src/apis/club-tags/repositories/club-tag.repository';
import { ClubsService } from '@src/apis/clubs/services/clubs.service';
import { ClubTag } from '@src/entities/ClubTag';

@Injectable()
export class ClubTagsService {
  constructor(
    private readonly clubTagRepository: ClubTagRepository,
    private readonly clubTagLinkRepository: ClubTagLinkRepository,
    @Inject(forwardRef(() => ClubsService))
    private readonly clubsService: ClubsService,
  ) {}

  async bulkCreate(
    userId: number,
    createClubTagDto: CreateClubTagDto,
  ): Promise<ClubTag[]> {
    const { names } = createClubTagDto;

    const existClubTags = await this.clubTagRepository.find({
      where: {
        name: In(names),
      },
    });

    if (existClubTags.length === createClubTagDto.names.length) {
      return existClubTags;
    }

    const existClubTagNamesSet = new Set(
      existClubTags.map((existClubTag) => existClubTag.name),
    );

    const notExistClubTagNames = names.filter(
      (name) => !existClubTagNamesSet.has(name),
    );

    const newClubTags = this.clubTagRepository.create(
      notExistClubTagNames.map((clubTagName) => {
        return { userId, name: clubTagName };
      }),
    );

    await this.clubTagRepository.insert(newClubTags);

    return existClubTags.concat(newClubTags);
  }
}
