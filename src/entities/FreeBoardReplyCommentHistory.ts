import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreeBoardCommentHistory } from './FreeBoardCommentHistory';
import { FreeBoardHistory } from './FreeBoardHistory';
import { User } from './User';

@Entity('free_board_reply_comment_history', { schema: 'dongurami_v2' })
export class FreeBoardReplyCommentHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 대댓글 고유 ID',
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
    name: 'is_anonymous',
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

  @ManyToOne(
    () => FreeBoardCommentHistory,
    (freeBoardCommentHistory) =>
      freeBoardCommentHistory.freeBoardReplyCommentHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([
    { name: 'free_board_comment_history_id', referencedColumnName: 'id' },
  ])
  freeBoardCommentHistory: FreeBoardCommentHistory;

  @ManyToOne(() => User, (user) => user.freeBoardReplyCommentHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => FreeBoardHistory,
    (freeBoardHistory) => freeBoardHistory.freeBoardReplyCommentHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'free_board_history_id', referencedColumnName: 'id' }])
  freeBoardHistory: FreeBoardHistory;
}
