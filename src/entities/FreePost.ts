import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreePostComment } from './FreePostComment';
import { FreePostHistory } from './FreePostHistory';
import { FreePostReaction } from './FreePostReaction';
import { FreePostReplyComment } from './FreePostReplyComment';
import { User } from './User';

@Entity('free_post')
export class FreePost {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'title', comment: '자유게시글 제목', length: 255 })
  title: string;

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('text', { name: 'description', comment: '자유게시글 내용' })
  description: string;

  @Column('int', {
    name: 'hit',
    comment: '조회수',
    unsigned: true,
    default: () => "'0'",
  })
  hit: number;

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
    enum: ['posting', 'remove'],
    default: () => "'posting'",
  })
  status: FreePostStatus;

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

  @ManyToOne(() => User, (user) => user.freePosts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => FreePostComment,
    (freePostComment) => freePostComment.freePost,
  )
  freePostComments: FreePostComment[];

  @OneToMany(
    () => FreePostHistory,
    (freePostHistory) => freePostHistory.freePost,
  )
  freePostHistories: FreePostHistory[];

  @OneToMany(
    () => FreePostReaction,
    (freePostReaction) => freePostReaction.freePost,
  )
  freePostReactions: FreePostReaction[];

  @OneToMany(
    () => FreePostReplyComment,
    (freePostReplyComment) => freePostReplyComment.freePost,
  )
  freePostReplyComments: FreePostReplyComment[];
}
