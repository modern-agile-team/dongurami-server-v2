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

@Entity('free_post_reply_comment_reaction')
export class FreePostReplyCommentReaction {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'reaction_type_id',
    comment: '리액션 타입 고유 ID',
    unsigned: true,
  })
  reactionTypeId: number;

  @Column('int', {
    name: 'user_id',
    comment: '유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'free_post_reply_comment_id',
    comment: '자유 게시글 대댓글 고유 ID',
    unsigned: true,
  })
  parentId: number;

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
