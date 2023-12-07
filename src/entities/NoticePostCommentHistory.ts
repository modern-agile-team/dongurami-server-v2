import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticePostHistory } from './NoticePostHistory';
import { NoticePostReplyCommentHistory } from './NoticePostReplyCommentHistory';
import { User } from './User';
import { BooleanTransformer } from './transformers/boolean.transformer';

@Entity('notice_post_comment_history', { schema: 'dongurami_local_db' })
export class NoticePostCommentHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지게시글 댓글 수정이력 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'description', comment: '댓글 본문', length: 255 })
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

  @ManyToOne(() => User, (user) => user.noticePostCommentHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => NoticePostHistory,
    (noticePostHistory) => noticePostHistory.noticePostCommentHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'notice_post_history_id', referencedColumnName: 'id' }])
  noticePostHistory: NoticePostHistory;

  @OneToMany(
    () => NoticePostReplyCommentHistory,
    (noticePostReplyCommentHistory) =>
      noticePostReplyCommentHistory.noticePostCommentHistory,
  )
  noticePostReplyCommentHistories: NoticePostReplyCommentHistory[];
}
