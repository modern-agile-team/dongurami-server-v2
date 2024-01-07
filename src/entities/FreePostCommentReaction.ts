import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreePostComment } from './FreePostComment';
import { ReactionType } from './ReactionType';
import { User } from './User';

@Entity('free_post_comment_reaction', { schema: 'dongurami_v2' })
export class FreePostCommentReaction {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 댓글 반응 고유 ID',
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
    name: 'free_post_comment_id',
    comment: '자유 게시글 댓글 고유 ID',
    unsigned: true,
  })
  parentId: number;

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
