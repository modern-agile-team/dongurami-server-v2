import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreeBoardHistory } from './FreeBoardHistory';
import { FreeBoardReplyCommentHistory } from './FreeBoardReplyCommentHistory';
import { User } from './User';

@Entity('free_board_comment_history', { schema: 'dongurami_v2' })
export class FreeBoardCommentHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유게시글 댓글 수정이력 고유 ID',
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

  @ManyToOne(() => User, (user) => user.freeBoardCommentHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => FreeBoardHistory,
    (freeBoardHistory) => freeBoardHistory.freeBoardCommentHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'free_board_history_id', referencedColumnName: 'id' }])
  freeBoardHistory: FreeBoardHistory;

  @OneToMany(
    () => FreeBoardReplyCommentHistory,
    (freeBoardReplyCommentHistory) =>
      freeBoardReplyCommentHistory.freeBoardCommentHistory,
  )
  freeBoardReplyCommentHistories: FreeBoardReplyCommentHistory[];
}
