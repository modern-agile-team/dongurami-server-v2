import { Injectable } from '@nestjs/common';

import { Transactional } from 'typeorm-transactional';

import { CreatePostTagDto } from '@src/apis/post-tags/dto/create-post-tag.dto';
import { PostTagDto } from '@src/apis/post-tags/dto/post-tag.dto';
import { PostTagRepository } from '@src/apis/post-tags/repositories/post-tag.repository';

@Injectable()
export class PostTagsService {
  constructor(private readonly postTagRepository: PostTagRepository) {}

  @Transactional()
  async create(userId: number, createPostTagDto: CreatePostTagDto) {
    const existPostTag = await this.findOneByName(createPostTagDto.name);

    if (existPostTag) {
      return existPostTag;
    }

    const newPostTag = await this.postTagRepository.save({
      userId,
      ...createPostTagDto,
    });

    return new PostTagDto(newPostTag);
  }

  async findOneByName(name: string) {
    const postTag = await this.postTagRepository.findOneBy({
      name,
    });

    if (postTag === null) {
      return;
    }

    return new PostTagDto(postTag);
  }
}
