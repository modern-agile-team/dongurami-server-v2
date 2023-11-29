import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreeBoard } from './FreeBoard';
import { FreeBoardCommentHistory } from './FreeBoardCommentHistory';
import { FreeBoardReplyCommentHistory } from './FreeBoardReplyCommentHistory';
import { User } from './User';

@Entity('free_board_history', { schema: 'dongurami_v2' })
export class FreeBoardHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 히스토리 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'title', comment: '자유게시글 제목', length: 255 })
  title: string;

  @Column('text', { name: 'description', comment: '자유게시글 내용' })
  description: string;

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

  @OneToMany(
    () => FreeBoardCommentHistory,
    (freeBoardCommentHistory) => freeBoardCommentHistory.freeBoardHistory,
  )
  freeBoardCommentHistories: FreeBoardCommentHistory[];

  @ManyToOne(() => User, (user) => user.freeBoardHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => FreeBoard, (freeBoard) => freeBoard.freeBoardHistories, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'free_board_id', referencedColumnName: 'id' }])
  freeBoard: FreeBoard;

  @OneToMany(
    () => FreeBoardReplyCommentHistory,
    (freeBoardReplyCommentHistory) =>
      freeBoardReplyCommentHistory.freeBoardHistory,
  )
  freeBoardReplyCommentHistories: FreeBoardReplyCommentHistory[];
}
