import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreeBoardComment } from './FreeBoardComment';
import { ReactionType } from './ReactionType';
import { User } from './User';

@Entity('free_board_comment_reaction', { schema: 'dongurami_v2' })
export class FreeBoardCommentReaction {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 댓글 반응 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.freeBoardCommentReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.freeBoardCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;

  @ManyToOne(
    () => FreeBoardComment,
    (freeBoardComment) => freeBoardComment.freeBoardCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'free_board_comment_id', referencedColumnName: 'id' }])
  freeBoardComment: FreeBoardComment;
}
