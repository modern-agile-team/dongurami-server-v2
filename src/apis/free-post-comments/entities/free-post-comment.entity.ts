import { FreePostCommentStatus } from '@src/apis/free-post-comments/constants/free-post-comment.enum';
import {
  BaseEntity,
  CreateEntityProps,
  EntityId,
} from '@src/common/base.entity';

interface FreePostCommentProps {
  userId: EntityId;
  freePostId: EntityId;
  parentId: EntityId;
  depth: number;
  description: string;
  isAnonymous: boolean;
  status: FreePostCommentStatus;
}

export class FreePostComment extends BaseEntity<FreePostCommentProps> {
  constructor(props: CreateEntityProps<FreePostCommentProps>) {
    super(props);
  }

  public validate(): void {}
}
