import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NoticePostCommentStatus } from '@src/apis/notice-post-comments/constants/notice-post-comment.enum';
import { NoticePost } from '@src/entities/NoticePost';
import { NoticePostCommentHistory } from '@src/entities/NoticePostCommentHistory';
import { NoticePostCommentReaction } from '@src/entities/NoticePostCommentReaction';
import { User } from '@src/entities/User';
import { DefaultFalseBooleanTransformer } from '@src/entities/transformers/default-false-boolean.transformer';

@Entity('notice_post_comment')
export class NoticePostComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 댓글 고유 ID',
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
    transformer: new DefaultFalseBooleanTransformer(),
  })
  isAnonymous: boolean;

  /**
   * @todo enum type 적용
   */
  @Column('enum', {
    name: 'status',
    comment: '공지 게시글 댓글 상태',
    enum: ['posting', 'remove'],
    default: () => "'posting'",
  })
  status: NoticePostCommentStatus;

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
    () => NoticePostComment,
    (noticePostComment) => noticePostComment.children,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'parent_id', referencedColumnName: 'id' }])
  parent: NoticePostComment;

  @OneToMany(
    () => NoticePostComment,
    (noticePostComment) => noticePostComment.parent,
  )
  children: NoticePostComment[];

  @ManyToOne(() => NoticePost, (noticePost) => noticePost.noticePostComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'notice_post_id', referencedColumnName: 'id' }])
  noticePost: NoticePost;

  @ManyToOne(() => User, (user) => user.noticePostComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => NoticePostCommentHistory,
    (noticePostCommentHistory) => noticePostCommentHistory.noticePostComment,
  )
  noticePostCommentHistories: NoticePostCommentHistory[];

  @OneToMany(
    () => NoticePostCommentReaction,
    (noticePostCommentReaction) => noticePostCommentReaction.noticePostComment,
  )
  noticePostCommentReactions: NoticePostCommentReaction[];
}
