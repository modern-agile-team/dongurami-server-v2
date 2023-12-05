import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { HistoryAction } from '@src/constants/enum';
import { BooleanTransformer } from '@src/entities/transfomers/boolean.transfomer';
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
import { FreePostReplyCommentHistory } from './FreePostReplyCommentHistory';
import { User } from './User';

@Entity('free_post_history', { schema: 'dongurami_v2' })
export class FreePostHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 히스토리 고유 ID',
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
    name: 'free_post_id',
    comment: '자유 게시글 고유 ID',
    unsigned: true,
  })
  freePostId: number;

  @Column('enum', {
    name: 'action',
    comment: 'history 를 쌓는 action',
    enum: ['insert', 'update', 'delete'],
  })
  action: HistoryAction;

  @Column('varchar', { name: 'title', comment: '자유게시글 제목', length: 255 })
  title: string;

  @Column('text', { name: 'description', comment: '자유게시글 내용' })
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
    comment: '자유게시글 상태',
    enum: FreePostStatus,
  })
  status: FreePostStatus;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(
    () => FreePostCommentHistory,
    (freePostCommentHistory) => freePostCommentHistory.freePostHistory,
  )
  freePostCommentHistories: FreePostCommentHistory[];

  @ManyToOne(() => User, (user) => user.freePostHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => FreePost, (freePost) => freePost.freePostHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'free_post_id', referencedColumnName: 'id' }])
  freePost: FreePost;

  @OneToMany(
    () => FreePostReplyCommentHistory,
    (freePostReplyCommentHistory) =>
      freePostReplyCommentHistory.freePostHistory,
  )
  freePostReplyCommentHistories: FreePostReplyCommentHistory[];
}
