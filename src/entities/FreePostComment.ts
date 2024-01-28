import { FreePostCommentStatus } from '@src/apis/free-post-comments/constants/free-post-comment.enum';
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
import { FreePostCommentHistory } from './FreePostCommentHistory';
import { FreePostCommentReaction } from './FreePostCommentReaction';
import { FreePostReplyComment } from './FreePostReplyComment';
import { User } from './User';

@Entity('free_post_comment')
export class FreePostComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 댓글 고유 ID',
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
    comment: '게시글 고유 ID',
    unsigned: true,
  })
  freePostId: number;

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

  @Column('timestamp', {
    name: 'updated_at',
    comment: '수정 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('timestamp', {
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => FreePost, (freePost) => freePost.freePostComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'free_post_id', referencedColumnName: 'id' }])
  freePost: FreePost;

  @ManyToOne(() => User, (user) => user.freePostComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => FreePostCommentHistory,
    (freePostCommentHistory) => freePostCommentHistory.freePostComment,
  )
  freePostCommentHistories: FreePostCommentHistory[];

  @OneToMany(
    () => FreePostCommentReaction,
    (freePostCommentReaction) => freePostCommentReaction.freePostComment,
  )
  freePostCommentReactions: FreePostCommentReaction[];

  @OneToMany(
    () => FreePostReplyComment,
    (freePostReplyComment) => freePostReplyComment.freePostComment,
  )
  freePostReplyComments: FreePostReplyComment[];
}
