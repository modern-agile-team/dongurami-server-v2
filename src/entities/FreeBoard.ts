import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreeBoardComment } from './FreeBoardComment';
import { FreeBoardReaction } from './FreeBoardReaction';
import { FreeBoardReplyComment } from './FreeBoardReplyComment';
import { User } from './User';

@Entity('free_board', { schema: 'dongurami_v2' })
export class FreeBoard {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'title', comment: '자유게시글 제목', length: 255 })
  title: string;

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
    name: 'isAnonymous',
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

  @ManyToOne(() => User, (user) => user.freeBoards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => FreeBoardComment,
    (freeBoardComment) => freeBoardComment.freeBoard,
  )
  freeBoardComments: FreeBoardComment[];

  @OneToMany(
    () => FreeBoardHistory,
    (freeBoardHistory) => freeBoardHistory.freeBoard,
  )
  freeBoardHistories: FreeBoardHistory[];

  @OneToMany(
    () => FreeBoardReaction,
    (freeBoardReaction) => freeBoardReaction.freeBoard,
  )
  freeBoardReactions: FreeBoardReaction[];

  @OneToMany(
    () => FreeBoardReplyComment,
    (freeBoardReplyComment) => freeBoardReplyComment.freeBoard,
  )
  freeBoardReplyComments: FreeBoardReplyComment[];
}
