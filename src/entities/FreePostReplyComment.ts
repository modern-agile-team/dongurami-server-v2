import { FreePostReplyCommentStatus } from '@src/apis/free-posts/constants/free-post-reply-comment.enum';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreePost } from './FreePost';
import { FreePostComment } from './FreePostComment';
import { FreePostReplyCommentReaction } from './FreePostReplyCommentReaction';
import { User } from './User';

@Entity('free_post_reply_comment', { schema: 'dongurami_v2' })
export class FreePostReplyComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 대댓글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '대댓글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'free_post_comment_id',
    comment: '게시글 댓글 고유 ID',
    unsigned: true,
  })
  freePostCommentId: number;

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

  @Column('timestamp', {
    name: 'updated_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('timestamp', {
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => FreePost, (freePost) => freePost.freePostReplyComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'free_post_id', referencedColumnName: 'id' }])
  freePost: FreePost;

  @ManyToOne(
    () => FreePostComment,
    (freePostComment) => freePostComment.freePostReplyComments,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'free_post_comment_id', referencedColumnName: 'id' }])
  freePostComment: FreePostComment;

  @ManyToOne(() => User, (user) => user.freePostReplyComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => FreePostReplyCommentReaction,
    (freePostReplyCommentReaction) =>
      freePostReplyCommentReaction.freePostReplyComment,
  )
  freePostReplyCommentReactions: FreePostReplyCommentReaction[];
}
