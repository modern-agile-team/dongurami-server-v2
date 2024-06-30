import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { NoticePostComment } from '@src/entities/NoticePostComment';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';

@Index(['userId'], {})
@Index(['noticePostId'], {})
@Entity('notice_post_comment_history')
export class NoticePostCommentHistory {
  @Column('bigint', {
    primary: true,
    name: 'id',
    comment: '공지 게시글 댓글 수정이력 고유 ID',
    unsigned: true,
    nullable: false,
  })
  id: string;

  @Column('bigint', {
    name: 'user_id',
    comment: '댓글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: string;

  @Column('bigint', {
    name: 'notice_post_id',
    comment: '공지 게시글 고유 ID',
    unsigned: true,
  })
  noticePostId: string;

  @Column('bigint', {
    name: 'notice_post_comment_id',
    comment: '공지 게시글 댓글 고유 ID',
    unsigned: true,
  })
  noticePostCommentId: string;

  @Column('bigint', {
    name: 'parent_id',
    comment: '부모 댓글 고유 ID',
    unsigned: true,
    nullable: true,
  })
  parentId: string | null;

  @Column('tinyint', {
    name: 'depth',
    comment: '댓글 깊이 (0부터 시작)',
    unsigned: true,
    default: () => "'0'",
  })
  depth: number;

  @Column('varchar', { name: 'description', comment: '댓글 본문', length: 255 })
  description: string;

  @Column('tinyint', {
    name: 'is_anonymous',
    comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(false),
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
