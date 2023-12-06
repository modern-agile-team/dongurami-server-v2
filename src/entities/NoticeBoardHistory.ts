import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeBoardCommentHistory } from './NoticeBoardCommentHistory';
import { NoticeBoardReplyCommentHistory } from './NoticeBoardReplyCommentHistory';
import { User } from './User';
import { NoticeBoard } from './NoticeBoard';
import { BooleanTransformer } from './transformers/boolean.transformer';
import { HistoryAction } from '@src/constants/enum';
import { NoticeBoardStatus } from '@src/apis/notice-boards/constants/notice-board.enum';

@Entity('notice_board_history', { schema: 'dongurami_local_db' })
export class NoticeBoardHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 히스토리 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'title', comment: '공지게시글 제목', length: 255 })
  title: string;

  @Column('text', { name: 'description', comment: '공지게시글 내용' })
  description: string;

  @Column('boolean', {
    name: 'is_allow_comment',
    comment: '댓글 허용 여부 (0: 비활성화, 1: 허용)',
    default: () => true,
    transformer: new BooleanTransformer(),
  })
  isAllowComment: boolean;

  @Column('enum', {
    name: 'action',
    comment: 'history 를 쌓는 action',
    enum: HistoryAction,
  })
  action: HistoryAction;

  @Column('enum', {
    name: 'status',
    comment: '공지게시글 상태',
    enum: NoticeBoardStatus,
  })
  status: NoticeBoardStatus;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(
    () => NoticeBoardCommentHistory,
    (noticeBoardCommentHistory) => noticeBoardCommentHistory.noticeBoardHistory,
  )
  noticeBoardCommentHistories: NoticeBoardCommentHistory[];

  @Column('int', {
    name: 'notice_board_id',
    comment: '공지 게시글 고유 ID',
    unsigned: true,
  })
  noticeBoardId: number;

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.noticeBoardHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => NoticeBoard,
    (noticeBoard) => noticeBoard.noticeBoardHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'notice_board_id', referencedColumnName: 'id' }])
  noticeBoard: NoticeBoard;

  @OneToMany(
    () => NoticeBoardReplyCommentHistory,
    (noticeBoardReplyCommentHistory) =>
      noticeBoardReplyCommentHistory.noticeBoardHistory,
  )
  noticeBoardReplyCommentHistories: NoticeBoardReplyCommentHistory[];
}
