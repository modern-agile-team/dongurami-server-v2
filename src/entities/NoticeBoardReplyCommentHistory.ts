import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NoticeBoardCommentHistory } from './NoticeBoardCommentHistory';
import { NoticeBoardHistory } from './NoticeBoardHistory';
import { User } from './User';
import { BooleanTransformer } from './transformers/boolean.transformer';

@Entity('notice_board_reply_comment_history', { schema: 'dongurami_local_db' })
export class NoticeBoardReplyCommentHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 대댓글 수정이력 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', {
    name: 'description',
    comment: '대댓글 본문',
    length: 255,
  })
  description: string;

  @Column('boolean', {
    name: 'is_anonymous',
    comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
    default: () => false,
    transformer: new BooleanTransformer(),
  })
  isAnonymous: boolean;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.noticeBoardReplyCommentHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => NoticeBoardCommentHistory,
    (noticeBoardCommentHistory) =>
      noticeBoardCommentHistory.noticeBoardReplyCommentHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([
    { name: 'notice_board_comment_history_id', referencedColumnName: 'id' },
  ])
  noticeBoardCommentHistory: NoticeBoardCommentHistory;

  @ManyToOne(
    () => NoticeBoardHistory,
    (noticeBoardHistory) => noticeBoardHistory.noticeBoardReplyCommentHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'notice_board_history_id', referencedColumnName: 'id' }])
  noticeBoardHistory: NoticeBoardHistory;
}
