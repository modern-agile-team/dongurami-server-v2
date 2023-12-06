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
  })
  isAnonymous: number;

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
