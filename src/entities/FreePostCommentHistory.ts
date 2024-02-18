import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FreePostCommentStatus } from '@src/apis/free-post-comments/constants/free-post-comment.enum';
import { HistoryAction } from '@src/constants/enum';
import { FreePostComment } from '@src/entities/FreePostComment';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';

@Index(['userId'], {})
@Index(['freePostId'], {})
@Entity('free_post_comment_history', { schema: 'dongurami_v2' })
export class FreePostCommentHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 댓글 수정이력 고유 ID',
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
    name: 'free_post_id',
    comment: '자유 게시글 고유 ID',
    unsigned: true,
  })
  freePostId: number;

  @Column('int', {
    name: 'free_post_comment_id',
    comment: '자유 게시글 댓글 고유 ID',
    unsigned: true,
  })
  freePostCommentId: number;

  @Column('int', {
    name: 'parent_id',
    comment: '부모 댓글 고유 ID',
    unsigned: true,
    nullable: true,
  })
  parentId: number | null;

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
    comment: '자유 게시글 댓글 상태',
    enum: ['posting', 'remove'],
    default: () => "'posting'",
  })
  status: FreePostCommentStatus;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(
    () => FreePostComment,
    (freePostComment) => freePostComment.freePostCommentHistories,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'free_post_comment_id', referencedColumnName: 'id' }])
  freePostComment: FreePostComment;
}
