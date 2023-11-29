import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeBoard } from './NoticeBoard';
import { NoticeBoardCommentReaction } from './NoticeBoardCommentReaction';
import { NoticeBoardReplyComment } from './NoticeBoardReplyComment';
import { User } from './User';

@Entity('notice_board_comment', { schema: 'dongurami_local_db' })
export class NoticeBoardComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지게시글 댓글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'description', comment: '댓글 본문', length: 255 })
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

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.noticeBoardComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @Column('int', {
    name: 'notice_board_id',
    comment: '공지 게시글 고유 ID',
    unsigned: true,
  })
  noticeBoardId: number;

  @ManyToOne(
    () => NoticeBoard,
    (noticeBoard) => noticeBoard.noticeBoardComments,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'notice_board_id', referencedColumnName: 'id' }])
  noticeBoard: NoticeBoard;

  @OneToMany(
    () => NoticeBoardCommentReaction,
    (noticeBoardCommentReaction) =>
      noticeBoardCommentReaction.noticeBoardComment,
  )
  noticeBoardCommentReactions: NoticeBoardCommentReaction[];

  @OneToMany(
    () => NoticeBoardReplyComment,
    (noticeBoardReplyComment) => noticeBoardReplyComment.noticeBoardComment,
  )
  noticeBoardReplyComments: NoticeBoardReplyComment[];
}
