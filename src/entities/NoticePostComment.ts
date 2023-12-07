import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticePost } from './NoticePost';
import { NoticePostCommentReaction } from './NoticePostCommentReaction';
import { NoticePostReplyComment } from './NoticePostReplyComment';
import { User } from './User';
import { BooleanTransformer } from './transformers/boolean.transformer';

@Entity('notice_post_comment', { schema: 'dongurami_local_db' })
export class NoticePostComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지게시글 댓글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'description', comment: '댓글 본문', length: 255 })
  description: string;

  @Column('boolean', {
    name: 'is_anonymous',
    comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
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

  @Column('timestamp', {
    name: 'updated_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.noticePostComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @Column('int', {
    name: 'notice_post_id',
    comment: '공지 게시글 고유 ID',
    unsigned: true,
  })
  noticePostId: number;

  @ManyToOne(() => NoticePost, (noticePost) => noticePost.noticePostComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'notice_post_id', referencedColumnName: 'id' }])
  noticePost: NoticePost;

  @OneToMany(
    () => NoticePostCommentReaction,
    (noticePostCommentReaction) => noticePostCommentReaction.noticePostComment,
  )
  noticePostCommentReactions: NoticePostCommentReaction[];

  @OneToMany(
    () => NoticePostReplyComment,
    (noticePostReplyComment) => noticePostReplyComment.noticePostComment,
  )
  noticePostReplyComments: NoticePostReplyComment[];
}
