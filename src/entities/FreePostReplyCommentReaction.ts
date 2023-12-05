import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreePostReplyComment } from './FreePostReplyComment';
import { ReactionType } from './ReactionType';
import { User } from './User';

@Entity('free_post_reply_comment_reaction', { schema: 'dongurami_v2' })
export class FreePostReplyCommentReaction {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 대댓글 반응 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.freePostReplyCommentReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => FreePostReplyComment,
    (freePostReplyComment) =>
      freePostReplyComment.freePostReplyCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([
    { name: 'free_post_reply_comment_id', referencedColumnName: 'id' },
  ])
  freePostReplyComment: FreePostReplyComment;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.freePostReplyCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;
}
