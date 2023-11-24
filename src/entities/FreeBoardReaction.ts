import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreeBoard } from './FreeBoard';
import { ReactionType } from './ReactionType';
import { User } from './User';

@Entity('free_board_reaction', { schema: 'dongurami_v2' })
export class FreeBoardReaction {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 반응 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.freeBoardReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => FreeBoard, (freeBoard) => freeBoard.freeBoardReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'free_board_id', referencedColumnName: 'id' }])
  freeBoard: FreeBoard;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.freeBoardReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;
}
