import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeBoardReplyComment } from './NoticeBoardReplyComment';
import { ReactionType } from './ReactionType';
import { User } from './User';

@Entity('notice_board_reply_comment_reaction', { schema: 'dongurami_local_db' })
export class NoticeBoardReplyCommentReaction {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 대댓글 반응 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.noticeBoardReplyCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;

  @Column('int', {
    name: 'notice_board_reply_comment_id',
    comment: '공지 게시글 대댓글 고유 ID',
    unsigned: true,
  })
  noticeBoardReplyCommentId: number;

  @ManyToOne(
    () => NoticeBoardReplyComment,
    (noticeBoardReplyComment) =>
      noticeBoardReplyComment.noticeBoardReplyCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([
    { name: 'notice_board_reply_comment_id', referencedColumnName: 'id' },
  ])
  noticeBoardReplyComment: NoticeBoardReplyComment;

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.noticeBoardReplyCommentReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
