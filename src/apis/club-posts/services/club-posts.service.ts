import { Injectable } from '@nestjs/common';

import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { CreateClubPostDto } from '@src/apis/club-posts/dto/create-club-post.dto';
import { ClubPostRepository } from '@src/apis/club-posts/repositories/club-post.repository';

@Injectable()
export class ClubPostsService {
  constructor(private readonly clubPostRepository: ClubPostRepository) {}

  async create(createClubPostDto: CreateClubPostDto): Promise<ClubPostDto> {
    const { attachments, ...createClubPostProps } = createClubPostDto;

    const newClubPost = this.clubPostRepository.create({
      ...createClubPostProps,
      status: ClubPostStatus.Posting,
    });

    await this.clubPostRepository.save(newClubPost);

    return new ClubPostDto({ ...newClubPost, attachments });
  }
}
