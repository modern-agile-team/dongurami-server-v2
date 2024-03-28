import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { In } from 'typeorm';

import { ClubTagLinksService } from '@src/apis/club-tag-links/services/club-tag-links.service';
import { CreateClubTagDto } from '@src/apis/club-tags/dto/create-club-tag.dto';
import { ClubTagRepository } from '@src/apis/club-tags/repositories/club-tag.repository';
import { ClubsService } from '@src/apis/clubs/services/clubs.service';
import { ClubTag } from '@src/entities/ClubTag';

@Injectable()
export class ClubTagsService {
  constructor(
    private readonly clubTagRepository: ClubTagRepository,
    @Inject(forwardRef(() => ClubsService))
    private readonly clubsService: ClubsService,
    private readonly clubTagLinksService: ClubTagLinksService,
  ) {}

  async create(
    userId: number,
    clubId: number,
    createClubTagDto: CreateClubTagDto,
  ): Promise<ClubTag[]> {
    const existClub = await this.clubsService.findOneOrNotFound(clubId);

    const { names } = createClubTagDto;

    const existClubTags = await this.clubTagRepository.find({
      where: {
        name: In(names),
      },
    });

    const existClubTagNames = existClubTags.map(
      (existClubTag) => existClubTag.name,
    );

    const notExistClubTagNames = names.filter(
      (name) => !existClubTagNames.includes(name),
    );

    const newClubTags = this.clubTagRepository.create(
      notExistClubTagNames.map((clubTagName) => {
        return { userId, name: clubTagName };
      }),
    );

    await this.clubTagRepository.save(newClubTags);

    await this.clubTagLinksService.create(
      existClubTags.concat(newClubTags).map((clubTag) => {
        return {
          userId,
          clubId: existClub.id,
          clubTagId: clubTag.id,
        };
      }),
    );

    return existClubTags.concat(newClubTags);
  }
}
