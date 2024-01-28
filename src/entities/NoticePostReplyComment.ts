import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticePost } from './NoticePost';
import { NoticePostComment } from './NoticePostComment';
import { NoticePostReplyCommentHistory } from './NoticePostReplyCommentHistory';
import { NoticePostReplyCommentReaction } from './NoticePostReplyCommentReaction';
import { User } from './User';

@Entity('notice_post_reply_comment')
export class NoticePostReplyComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 대댓글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 유저 고유 ID',
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

  /**
   * @todo enum type 적용
   */
  @Column('enum', {
    name: 'status',
    comment: '공지 게시글 대댓글 상태',
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

  @ManyToOne(
    () => NoticePost,
    (noticePost) => noticePost.noticePostReplyComments,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'notice_post_id', referencedColumnName: 'id' }])
  noticePost: NoticePost;

  @ManyToOne(
    () => NoticePostComment,
    (noticePostComment) => noticePostComment.noticePostReplyComments,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'notice_post_comment_id', referencedColumnName: 'id' }])
  noticePostComment: NoticePostComment;

  @ManyToOne(() => User, (user) => user.noticePostReplyComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => NoticePostReplyCommentHistory,
    (noticePostReplyCommentHistory) =>
      noticePostReplyCommentHistory.noticePostReplyComment,
  )
  noticePostReplyCommentHistories: NoticePostReplyCommentHistory[];

  @OneToMany(
    () => NoticePostReplyCommentReaction,
    (noticePostReplyCommentReaction) =>
      noticePostReplyCommentReaction.noticePostReplyComment,
  )
  noticePostReplyCommentReactions: NoticePostReplyCommentReaction[];
}
