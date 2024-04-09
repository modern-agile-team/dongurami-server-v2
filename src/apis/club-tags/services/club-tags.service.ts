import { Injectable } from '@nestjs/common';

import { In } from 'typeorm';

import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { CreateClubTagDto } from '@src/apis/club-tags/dto/create-club-tag.dto';
import { ClubTagRepository } from '@src/apis/club-tags/repositories/club-tag.repository';

@Injectable()
export class ClubTagsService {
  constructor(private readonly clubTagRepository: ClubTagRepository) {}

  async bulkCreate(
    userId: number,
    createClubTagDto: CreateClubTagDto,
  ): Promise<ClubTagDto[]> {
    const { names } = createClubTagDto;

    const existClubTags = await this.clubTagRepository.find({
      where: {
        name: In(names),
      },
    });

    if (existClubTags.length === names.length) {
      return existClubTags.map((clubTag) => new ClubTagDto(clubTag));
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

    return existClubTags
      .concat(newClubTags)
      .map((clubTag) => new ClubTagDto(clubTag));
  }
}
