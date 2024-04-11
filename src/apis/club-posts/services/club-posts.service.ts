import { Injectable } from '@nestjs/common';

import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { ClubPostRepository } from '@src/apis/club-posts/repositories/club-post.repository';
import { CreateClubPostRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-request-body.dto';

@Injectable()
export class ClubPostsService {
  constructor(private readonly clubPostRepository: ClubPostRepository) {}

  async create(
    userId: number,
    clubId: number,
    createClubPostRequestBodyDto: CreateClubPostRequestBodyDto,
  ): Promise<ClubPostDto> {
    const newClubPost = this.clubPostRepository.create({
      userId,
      clubId,
      ...createClubPostRequestBodyDto,
    });

    await this.clubPostRepository.save(newClubPost);

    return new ClubPostDto(newClubPost);
  }
}
