import { FreePostReplyCommentStatus } from '@src/apis/free-post-reply-comments/constants/free-post-reply-comment.enum';
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
import { FreePostReplyComment } from './FreePostReplyComment';

@Index('FK_ad99256ee668d71d6b29731147c', ['userId'], {})
@Index('FK_3f1f6a673500b56a8af310543de', ['freePostId'], {})
@Index('FK_60a5d4d50145f5b36511c9c8f49', ['freePostCommentId'], {})
@Entity('free_post_reply_comment_history')
export class FreePostReplyCommentHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 대댓글 수정이력 고유 ID',
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
    name: 'free_post_comment_id',
    comment: '자유 게시글 대댓글 고유 ID',
    unsigned: true,
  })
  freePostReplyCommentId: number;

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
    comment: '자유 게시글 대댓글 상태',
    enum: ['posting', 'remove'],
    default: () => "'posting'",
  })
  status: FreePostReplyCommentStatus;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(
    () => FreePostReplyComment,
    (freePostReplyComment) =>
      freePostReplyComment.freePostReplyCommentHistories,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([
    { name: 'free_post_reply_comment_id', referencedColumnName: 'id' },
  ])
  freePostReplyComment: FreePostReplyComment;
}
