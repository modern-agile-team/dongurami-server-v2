import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { FreePostComment } from '@src/entities/FreePostComment';
import { ReactionType } from '@src/entities/ReactionType';
import { User } from '@src/entities/User';

@Entity('free_post_comment_reaction')
export class FreePostCommentReaction {
  @Column('bigint', {
    primary: true,
    name: 'id',
    comment: '고유 ID',
    unsigned: true,
    nullable: false,
  })
  id: string;

  @Column('bigint', {
    name: 'reaction_type_id',
    comment: '리액션 타입 고유 ID',
    unsigned: true,
  })
  reactionTypeId: string;

  @Column('bigint', {
    name: 'user_id',
    comment: '유저 고유 ID',
    unsigned: true,
  })
  userId: string;

  @Column('bigint', {
    name: 'free_post_comment_id',
    comment: '자유 게시글 댓글 고유 ID',
    unsigned: true,
  })
  parentId: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.freePostCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;

  @ManyToOne(
    () => FreePostComment,
    (freePostComment) => freePostComment.freePostCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'free_post_comment_id', referencedColumnName: 'id' }])
  freePostComment: FreePostComment;

  @ManyToOne(() => User, (user) => user.freePostCommentReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
