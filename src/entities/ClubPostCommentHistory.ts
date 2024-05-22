import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubPostCommentStatus } from '@src/apis/club-post-comments/constants/club-post-comment.enum';
import { HistoryAction } from '@src/constants/enum';
import { ClubPostComment } from '@src/entities/ClubPostComment';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';

@Entity('club_post_comment_history')
export class ClubPostCommentHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 게시글 댓글 수정이력 고유 ID',
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
    name: 'club_post_id',
    comment: '동아리 게시글 고유 ID',
    unsigned: true,
  })
  clubPostId: number;

  @Column('int', {
    name: 'club_post_comment_id',
    unsigned: true,
    comment: '동아리 게시글 댓글 고유 ID',
  })
  clubPostCommentId: number;

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
    name: 'status',
    comment: '동아리 게시글 댓글 상태',
    enum: ['posting', 'remove'],
    default: () => "'posting'",
  })
  status: ClubPostCommentStatus;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('int', {
    name: 'parent_id',
    nullable: true,
    comment: '부모 댓글 고유 ID',
    unsigned: true,
  })
  parentId: number | null;

  @Column('tinyint', {
    name: 'depth',
    comment: '댓글 깊이 (0부터 시작)',
    unsigned: true,
    default: () => "'0'",
  })
  depth: number;

  @Column('enum', {
    name: 'action',
    comment: 'history를 쌓는 action',
    enum: ['insert', 'update', 'delete'],
  })
  action: HistoryAction;

  @ManyToOne(
    () => ClubPostComment,
    (clubPostComment) => clubPostComment.clubPostCommentHistories,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'club_post_comment_id', referencedColumnName: 'id' }])
  clubPostComment: ClubPostComment;
}
