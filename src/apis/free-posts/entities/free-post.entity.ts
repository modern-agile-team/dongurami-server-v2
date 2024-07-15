import { getTsid } from 'tsid-ts';

import { FreePostComment } from '@src/apis/free-post-comments/entities/free-post-comment.entity';
import { FreePostReactionDto } from '@src/apis/free-posts/dto/free-post-reaction.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { POST_TAG_COUNT } from '@src/apis/post-tags/constants/post-tag.constant';
import { PostTag } from '@src/apis/post-tags/entities/post-tag.entity';
import { Reaction } from '@src/apis/reactions/entities/reaction.entity';
import { User } from '@src/apis/users/entities/user.entity';
import {
  BaseEntity,
  CreateEntityProps,
  EntityId,
} from '@src/common/base.entity';

interface FreePostProps {
  userId: EntityId;

  title: string;
  description: string;
  hit: number;
  isAnonymous: boolean;

  user?: User;

  tags: PostTag[];
  comments?: FreePostComment[];
  reactions?: Reaction[];
}

interface CreateFreePostProps {
  userId: EntityId;

  title: string;
  description: string;
  isAnonymous: boolean;

  tagNames: string[];
}

interface UpdateFreePostProps {
  title?: string;
  description?: string;
  isAnonymous?: boolean;

  tagNames?: string[];
}

export enum FreePostStatus {
  Posting = 'posting',
  Remove = 'remove',
}

export const FREE_POST_REACTION_ORDER_FIELD: readonly (keyof FreePostReactionDto)[] =
  ['id', 'type', 'userId', 'createdAt'] as const;

export class FreePost extends BaseEntity<FreePostProps> {
  static readonly TITLE_LENGTH = {
    MIN: 1,
    MAX: 255,
  } as const;

  constructor(props: CreateEntityProps<FreePostProps>) {
    super(props);
  }

  static create(createFreePostProps: CreateFreePostProps) {
    return new FreePost({
      id: getTsid().toBigInt().toString(),
      props: {
        ...createFreePostProps,
        tags: createFreePostProps.tagNames.map((tagName) =>
          PostTag.create({ userId: createFreePostProps.userId, name: tagName }),
        ),
        hit: 0,
      },
    });
  }

  get userId() {
    return this.props.userId;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get hit() {
    return this.props.hit;
  }

  get isAnonymous() {
    return this.props.isAnonymous;
  }

  get tags() {
    return this.props.tags;
  }

  get user() {
    return this.props.user;
  }

  set user(value: User) {
    this.props.user = value;
  }

  public validate(): void {
    if (this.props.tags.length > POST_TAG_COUNT.MAX) {
      throw new Error();
    }
  }

  createPostTag(tagName: string) {
    const existingTag = this.props.tags.find((tag) => tag.name === tagName);

    if (existingTag !== undefined) {
      throw new Error();
    }

    return PostTag.create({ userId: this.props.userId, name: tagName });
  }

  appendTag(tagName: string) {
    const existingTag = this.props.tags.find((tag) => tag.name === tagName);

    if (existingTag !== undefined) {
      throw new Error();
    }

    this.props.tags.push(
      PostTag.create({ userId: this.props.userId, name: tagName }),
    );
  }

  update(props: UpdateFreePostProps) {
    if (props.title !== undefined) {
      this.props.title === props.title;
    }

    if (props.description !== undefined) {
      this.props.description === props.description;
    }

    if (props.isAnonymous !== undefined) {
      this.props.isAnonymous === props.isAnonymous;
    }

    if (props.tagNames !== undefined) {
      this.props.tags = props.tagNames.map((tagName) => {
        const existingTag = this.props.tags.find((tag) => tag.name === tagName);

        if (existingTag) {
          return existingTag;
        }
        return PostTag.create({ userId: this.props.userId, name: tagName });
      });
    }
  }
}

export const FREE_POST_ORDER_FIELD: readonly (keyof FreePostDto)[] = [
  'id',
  'userId',
  'title',
  'hit',
  'isAnonymous',
  'createdAt',
  'updatedAt',
] as const;
