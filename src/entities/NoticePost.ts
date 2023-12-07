import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticePostComment } from './NoticePostComment';
import { NoticePostReaction } from './NoticePostReaction';
import { NoticePostReplyComment } from './NoticePostReplyComment';
import { User } from './User';
import { NoticePostHistory } from './NoticePostHistory';
import { BooleanTransformer } from './transformers/boolean.transformer';
import { NoticePostStatus } from '@src/apis/notice-posts/constants/notice-post.enum';

@Entity('notice_post', { schema: 'dongurami_local_db' })
export class NoticePost {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'title', comment: '공지게시글 제목', length: 255 })
  title: string;

  @Column('text', { name: 'description', comment: '공지게시글 내용' })
  description: string;

  @Column('int', {
    name: 'hit',
    comment: '조회수',
    unsigned: true,
    default: () => "'0'",
  })
  hit: number;

  @Column('boolean', {
    name: 'is_allow_comment',
    comment: '댓글 허용 여부 (0: 비활성화, 1: 허용)',
    default: () => true,
    transformer: new BooleanTransformer(),
  })
  isAllowComment: boolean;

  @Column('enum', {
    name: 'status',
    comment: '공지게시글 상태',
    enum: NoticePostStatus,
  })
  status: NoticePostStatus;

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

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.noticePosts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => NoticePostComment,
    (noticePostComment) => noticePostComment.noticePost,
  )
  noticePostComments: NoticePostComment[];

  @OneToMany(
    () => NoticePostReaction,
    (noticePostReaction) => noticePostReaction.noticePost,
  )
  noticePostReactions: NoticePostReaction[];

  @OneToMany(
    () => NoticePostReplyComment,
    (noticePostReplyComment) => noticePostReplyComment.noticePost,
  )
  noticePostReplyComments: NoticePostReplyComment[];

  @OneToMany(
    () => NoticePostHistory,
    (noticePostHistories) => noticePostHistories.noticePost,
  )
  noticePostHistories: NoticePostHistory[];
}
