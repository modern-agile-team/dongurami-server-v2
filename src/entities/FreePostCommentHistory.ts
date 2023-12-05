import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreePostHistory } from './FreePostHistory';
import { FreePostReplyCommentHistory } from './FreePostReplyCommentHistory';
import { User } from './User';

@Entity('free_post_comment_history', { schema: 'dongurami_v2' })
export class FreePostCommentHistory {
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

  @ManyToOne(() => User, (user) => user.freePostCommentHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => FreePostHistory,
    (freePostHistory) => freePostHistory.freePostCommentHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'free_post_history_id', referencedColumnName: 'id' }])
  freePostHistory: FreePostHistory;

  @OneToMany(
    () => FreePostReplyCommentHistory,
    (freePostReplyCommentHistory) =>
      freePostReplyCommentHistory.freePostCommentHistory,
  )
  freePostReplyCommentHistories: FreePostReplyCommentHistory[];
}
