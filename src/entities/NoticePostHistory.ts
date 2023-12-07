import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticePostCommentHistory } from './NoticePostCommentHistory';
import { NoticePostReplyCommentHistory } from './NoticePostReplyCommentHistory';
import { User } from './User';
import { NoticePost } from './NoticePost';
import { BooleanTransformer } from './transformers/boolean.transformer';
import { HistoryAction } from '@src/constants/enum';
import { NoticePostStatus } from '@src/apis/notice-posts/constants/notice-post.enum';

@Entity('notice_post_history', { schema: 'dongurami_local_db' })
export class NoticePostHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 히스토리 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'title', comment: '공지게시글 제목', length: 255 })
  title: string;

  @Column('text', { name: 'description', comment: '공지게시글 내용' })
  description: string;

  @Column('boolean', {
    name: 'is_allow_comment',
    comment: '댓글 허용 여부 (0: 비활성화, 1: 허용)',
    default: () => true,
    transformer: new BooleanTransformer(),
  })
  isAllowComment: boolean;

  @Column('enum', {
    name: 'action',
    comment: 'history 를 쌓는 action',
    enum: HistoryAction,
  })
  action: HistoryAction;

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

  @OneToMany(
    () => NoticePostCommentHistory,
    (noticePostCommentHistory) => noticePostCommentHistory.noticePostHistory,
  )
  noticePostCommentHistories: NoticePostCommentHistory[];

  @Column('int', {
    name: 'notice_post_id',
    comment: '공지 게시글 고유 ID',
    unsigned: true,
  })
  noticePostId: number;

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.noticePostHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => NoticePost, (noticePost) => noticePost.noticePostHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'notice_post_id', referencedColumnName: 'id' }])
  noticePost: NoticePost;

  @OneToMany(
    () => NoticePostReplyCommentHistory,
    (noticePostReplyCommentHistory) =>
      noticePostReplyCommentHistory.noticePostHistory,
  )
  noticePostReplyCommentHistories: NoticePostReplyCommentHistory[];
}
