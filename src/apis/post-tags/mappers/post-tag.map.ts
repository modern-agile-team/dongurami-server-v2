import { PostTagItemDto } from '@src/apis/post-tags/dto/post-tag-item.dto';
import { PostTagDto } from '@src/apis/post-tags/dto/post-tag.dto';
import { PostTag } from '@src/apis/post-tags/entities/post-tag.entity';
import { PostTag as PostTagOrmEntity } from '@src/entities/PostTag';

export class PostTagMap {
  static toEntity(record: PostTagOrmEntity): PostTag {
    return new PostTag({
      id: record.id,
      props: {
        userId: record.userId,
        name: record.name,
      },
      createdAt: record.createdAt,
    });
  }

  static toPersistence(entity: PostTag): PostTagOrmEntity {
    return {
      id: entity.id,
      userId: entity.userId,
      name: entity.name,
      createdAt: entity.createdAt,
    } as PostTagOrmEntity;
  }

  static toDto(entity: PostTag): PostTagDto {
    const dto = new PostTagDto();

    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.name = entity.name;
    dto.createdAt = entity.createdAt;

    return dto;
  }

  static toItemDto(entity: PostTag): PostTagItemDto {
    const dto = new PostTagItemDto();

    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.name = entity.name;
    dto.createdAt = entity.createdAt;

    return dto;
  }
}
