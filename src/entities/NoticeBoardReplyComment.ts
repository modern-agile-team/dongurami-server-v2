import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeBoard } from './NoticeBoard';
import { NoticeBoardComment } from './NoticeBoardComment';
import { NoticeBoardReplyCommentReaction } from './NoticeBoardReplyCommentReaction';
import { User } from './User';

@Entity('notice_board_reply_comment', { schema: 'dongurami_local_db' })
export class NoticeBoardReplyComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 대댓글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', {
    name: 'description',
    comment: '대댓글 본문',
    length: 255,
  })
  description: string;

  @Column('tinyint', {
    name: 'isAnonymous',
    comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
    unsigned: true,
    default: () => "'0'",
  })
  isAnonymous: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(
    () => NoticeBoard,
    (noticeBoard) => noticeBoard.noticeBoardReplyComments,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'notice_board_id', referencedColumnName: 'id' }])
  noticeBoard: NoticeBoard;

  @ManyToOne(
    () => NoticeBoardComment,
    (noticeBoardComment) => noticeBoardComment.noticeBoardReplyComments,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'notice_board_comment_id', referencedColumnName: 'id' }])
  noticeBoardComment: NoticeBoardComment;

  @ManyToOne(() => User, (user) => user.noticeBoardReplyComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => NoticeBoardReplyCommentReaction,
    (noticeBoardReplyCommentReaction) =>
      noticeBoardReplyCommentReaction.noticeBoardReplyComment,
  )
  noticeBoardReplyCommentReactions: NoticeBoardReplyCommentReaction[];
}
