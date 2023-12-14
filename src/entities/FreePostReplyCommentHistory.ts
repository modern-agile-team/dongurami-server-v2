import { FreePostReplyCommentStatus } from '@src/apis/free-posts/free-post-comments/constants/free-post-comment.enum';
import { HistoryAction } from '@src/constants/enum';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreePostCommentHistory } from './FreePostCommentHistory';
import { FreePostHistory } from './FreePostHistory';
import { User } from './User';

@Entity('free_post_reply_comment_history', { schema: 'dongurami_v2' })
export class FreePostReplyCommentHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 대댓글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '게시글 대댓글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'free_post_comment_history_id',
    comment: '자유 게시글 대댓글 수정이력 고유 ID',
    unsigned: true,
  })
  freePostCommentHistoryId: number;

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
    transformer: new BooleanTransformer(),
  })
  isAnonymous: boolean;

  @Column('enum', {
    name: 'action',
    comment: 'history 를 쌓는 action',
    enum: ['insert', 'update', 'delete'],
  })
  action: HistoryAction;

  @Column('enum', {
    name: 'status',
    comment: '자유게시글 댓글 상태',
    enum: FreePostReplyCommentStatus,
  })
  status: FreePostReplyCommentStatus;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(
    () => FreePostCommentHistory,
    (freePostCommentHistory) =>
      freePostCommentHistory.freePostReplyCommentHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([
    { name: 'free_post_comment_history_id', referencedColumnName: 'id' },
  ])
  freePostCommentHistory: FreePostCommentHistory;

  @ManyToOne(() => User, (user) => user.freePostReplyCommentHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => FreePostHistory,
    (freePostHistory) => freePostHistory.freePostReplyCommentHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'free_post_history_id', referencedColumnName: 'id' }])
  freePostHistory: FreePostHistory;
}
