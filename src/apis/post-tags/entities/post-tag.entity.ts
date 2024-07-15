import { getTsid } from 'tsid-ts';

import {
  BaseEntity,
  CreateEntityProps,
  EntityId,
} from '@src/common/base.entity';

interface PostTagProps {
  userId: EntityId;
  name: string;
}

interface CreatePostTagProps {
  userId: EntityId;
  name: string;
}

export class PostTag extends BaseEntity<PostTagProps> {
  constructor(props: CreateEntityProps<PostTagProps>) {
    super(props);
  }

  static create(createPostTagProps: CreatePostTagProps) {
    return new PostTag({
      id: getTsid().toBigInt().toString(),
      props: createPostTagProps,
    });
  }

  get userId() {
    return this.props.userId;
  }

  get name() {
    return this.props.name;
  }

  public validate(): void {}
}
