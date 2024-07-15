import { ReactionName } from '@src/apis/reactions/constants/reaction.enum';
import {
  BaseEntity,
  CreateEntityProps,
  EntityId,
} from '@src/common/base.entity';

interface ReactionProps {
  userId: EntityId;
  parentId: EntityId;

  type: ReactionName;
}

export class Reaction extends BaseEntity<ReactionProps> {
  constructor(props: CreateEntityProps<ReactionProps>) {
    super(props);
  }

  public validate(): void {}
}
