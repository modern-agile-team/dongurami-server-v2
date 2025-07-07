import { Injectable } from '@nestjs/common';

import { difference } from 'lodash';
import { getTsid } from 'tsid-ts';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CreatePostTagDto } from '@src/apis/post-tags/dto/create-post-tag.dto';
import { PostTagDto } from '@src/apis/post-tags/dto/post-tag.dto';
import { PostTagRepository } from '@src/apis/post-tags/repositories/post-tag.repository';

@Injectable()
export class PostTagsService {
  constructor(private readonly postTagRepository: PostTagRepository) {}

  @Transactional()
  async create(userId: string, createPostTagDto: CreatePostTagDto) {
    const existPostTag = await this.findOneByName(createPostTagDto.name);

    if (existPostTag) {
      return existPostTag;
    }

    const newPostTag = await this.postTagRepository.save({
      id: getTsid().toBigInt().toString(),
      userId,
      ...createPostTagDto,
    });

    return new PostTagDto(newPostTag);
  }

  async bulkCreate(
    userId: string,
    createPostTagDtos: CreatePostTagDto[],
  ): Promise<PostTagDto[]> {
    if (createPostTagDtos.length === 0) {
      return [];
    }

    const tagNames = createPostTagDtos.map((dto) => dto.name);

    const existTags = await this.findByNames(tagNames);
    const existTagNames = existTags.map((tag) => tag.name);

    const newTagNames = difference(tagNames, existTagNames);

    if (newTagNames.length === 0) {
      return existTags;
    }

    const newTags = newTagNames.map((tagName) =>
      this.postTagRepository.create({
        id: getTsid().toBigInt().toString(),
        userId,
        name: tagName,
      }),
    );

    await this.postTagRepository.insert(newTags);

    return [...existTags, ...newTags].map((tag) => new PostTagDto(tag));
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

  async findByNames(names: string[]) {
    if (names.length === 0) {
      return [];
    }

    const postTags = await this.postTagRepository.findBy({
      name: In([...new Set(names)]),
    });

    return postTags.map((postTag) => new PostTagDto(postTag));
  }
}
