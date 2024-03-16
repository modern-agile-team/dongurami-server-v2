import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NoticePostComment } from '@src/entities/NoticePostComment';
import { ReactionType } from '@src/entities/ReactionType';
import { User } from '@src/entities/User';

@Entity('notice_post_comment_reaction')
export class NoticePostCommentReaction {
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
    comment: '게시글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'notice_post_comment_id',
    comment: '공지 게시글 댓글 고유 ID',
    unsigned: true,
  })
  parentId: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.noticePostCommentReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.noticePostCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;

  @ManyToOne(
    () => NoticePostComment,
    (noticePostComment) => noticePostComment.noticePostCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'notice_post_comment_id', referencedColumnName: 'id' }])
  noticePostComment: NoticePostComment;
}
