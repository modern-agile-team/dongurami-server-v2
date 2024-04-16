import { Injectable } from '@nestjs/common';

import { difference } from 'lodash';
import { In } from 'typeorm';

import { ClubPostTagDto } from '@src/apis/club-post-tags/dto/club-post-tag.dto';
import { CreateClubPostTagDto } from '@src/apis/club-post-tags/dto/create-club-post-tag.dto';
import { ClubPostTagRepository } from '@src/apis/club-post-tags/repositories/club-post-tag.repository';

@Injectable()
export class ClubPostTagsService {
  constructor(private readonly clubPostTagRepository: ClubPostTagRepository) {}

  async bulkCreate(
    userId: number,
    createClubPostTagDtos: CreateClubPostTagDto[],
  ): Promise<ClubPostTagDto[]> {
    if (!createClubPostTagDtos.length) {
      return [];
    }

    const createClubPostTagNames = [
      ...new Set(
        createClubPostTagDtos.map(
          (createClubPostTagDto) => createClubPostTagDto.name,
        ),
      ),
    ];

    const existClubPostTags = await this.findByNames(createClubPostTagNames);

    if (existClubPostTags.length === createClubPostTagNames.length) {
      return existClubPostTags;
    }

    const existClubPostTagNames = existClubPostTags.map(
      (existClubPostTag) => existClubPostTag.name,
    );

    const newClubPostTagNames: string[] = difference(
      createClubPostTagNames,
      existClubPostTagNames,
    );

    const newClubPostTags = this.clubPostTagRepository.create(
      newClubPostTagNames.map((name) => {
        return {
          userId,
          name,
        };
      }),
    );

    await this.clubPostTagRepository.insert(newClubPostTags);

    return [...existClubPostTags, ...newClubPostTags].map(
      (newClubPostTag) => new ClubPostTagDto(newClubPostTag),
    );
  }

  async findByNames(clubPostTagNames: string[]): Promise<ClubPostTagDto[]> {
    const existClubPostTags = await this.clubPostTagRepository.findBy({
      name: In(clubPostTagNames),
    });

    if (!existClubPostTags.length) {
      return [];
    }

    return existClubPostTags.map(
      (existClubPostTag) => new ClubPostTagDto(existClubPostTag),
    );
  }
}
