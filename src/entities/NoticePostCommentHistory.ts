import { HistoryAction } from '@src/constants/enum';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticePostComment } from './NoticePostComment';

@Index(['userId'], {})
@Index(['noticePostId'], {})
@Entity('notice_post_comment_history')
export class NoticePostCommentHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 댓글 수정이력 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '댓글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'notice_post_id',
    comment: '공지 게시글 고유 ID',
    unsigned: true,
  })
  noticePostId: number;

  @Column('int', {
    name: 'notice_post_comment_id',
    comment: '공지 게시글 댓글 고유 ID',
    unsigned: true,
  })
  noticePostCommentId: number;

  @Column('varchar', { name: 'description', comment: '댓글 본문', length: 255 })
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

  /**
   * @todo enum type 적용
   */
  @Column('enum', {
    name: 'status',
    comment: '공지 게시글 댓글 상태',
    enum: ['posting', 'remove'],
    default: () => "'posting'",
  })
  status: 'posting' | 'remove';

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(
    () => NoticePostComment,
    (noticePostComment) => noticePostComment.noticePostCommentHistories,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'notice_post_comment_id', referencedColumnName: 'id' }])
  noticePostComment: NoticePostComment;
}
