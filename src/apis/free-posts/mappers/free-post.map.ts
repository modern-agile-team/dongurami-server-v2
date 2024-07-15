import { Injectable } from '@nestjs/common';

import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { FreePostsItemDto } from '@src/apis/free-posts/dto/free-posts-item.dto';
import { FreePost } from '@src/apis/free-posts/entities/free-post.entity';
import { PostTagMap } from '@src/apis/post-tags/mappers/post-tag.map';
import { UserMap } from '@src/apis/users/mappers/user.map';
import { FreePost as FreePostOrmEntity } from '@src/entities/FreePost';

@Injectable()
export class FreePostMap {
  static toEntity(record: FreePostOrmEntity): FreePost {
    return new FreePost({
      id: record.id,
      props: {
        userId: record.userId,
        title: record.title,
        description: record.description,
        hit: record.hit,
        isAnonymous: record.isAnonymous,

        user: record.user ? UserMap.toEntity(record.user) : undefined,

        tags: record.tags.map(PostTagMap.toEntity),
      },
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(entity: FreePost): FreePostOrmEntity {
    return {
      id: entity.id,
      userId: entity.props.userId,
      title: entity.props.title,
      description: entity.props.description,
      hit: entity.props.hit,
      isAnonymous: entity.props.isAnonymous,
      // status: entity.props.status,
      tags: entity.props.tags.map(PostTagMap.toPersistence),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } as unknown as FreePostOrmEntity;
  }

  static toDto(entity: FreePost): FreePostDto {
    const dto = new FreePostDto();

    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.hit = entity.hit;
    dto.isAnonymous = entity.isAnonymous;

    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    dto.postTags = entity.tags.map(PostTagMap.toItemDto);

    dto.user = UserMap.toDto(entity.user);

    if (dto.isAnonymous === true) {
      dto.userId === null;
      dto.user = null;

      dto.postTags.forEach((_, idx) => {
        dto.postTags[idx].userId = null;
      });
    }

    return dto;
  }

  static toItemDto(entity: FreePost): FreePostsItemDto {
    const dto = new FreePostsItemDto();

    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.title = entity.title;
    dto.hit = entity.hit;
    dto.isAnonymous = entity.isAnonymous;

    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    dto.user = UserMap.toDto(entity.user);

    if (dto.isAnonymous === true) {
      dto.userId === null;
      dto.user = null;
    }

    return dto;
  }
}
