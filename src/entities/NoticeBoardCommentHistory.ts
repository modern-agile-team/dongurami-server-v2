import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeBoardHistory } from './NoticeBoardHistory';
import { NoticeBoardReplyCommentHistory } from './NoticeBoardReplyCommentHistory';
import { User } from './User';
import { BooleanTransformer } from './transformers/boolean.transformer';

@Entity('notice_board_comment_history', { schema: 'dongurami_local_db' })
export class NoticeBoardCommentHistory {
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
    name: 'isAnonymous',
    comment: '작성자 익명 여부 (false: 실명, true: 익명)',
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

  @ManyToOne(() => User, (user) => user.noticeBoardCommentHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => NoticeBoardHistory,
    (noticeBoardHistory) => noticeBoardHistory.noticeBoardCommentHistories,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'notice_board_history_id', referencedColumnName: 'id' }])
  noticeBoardHistory: NoticeBoardHistory;

  @OneToMany(
    () => NoticeBoardReplyCommentHistory,
    (noticeBoardReplyCommentHistory) =>
      noticeBoardReplyCommentHistory.noticeBoardCommentHistory,
  )
  noticeBoardReplyCommentHistories: NoticeBoardReplyCommentHistory[];
}
