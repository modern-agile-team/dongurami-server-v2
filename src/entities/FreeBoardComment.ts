import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreeBoard } from './FreeBoard';
import { FreeBoardCommentReaction } from './FreeBoardCommentReaction';
import { FreeBoardReplyComment } from './FreeBoardReplyComment';
import { User } from './User';

@Entity('free_board_comment', { schema: 'dongurami_v2' })
export class FreeBoardComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유게시글 댓글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'description', comment: '댓글 본문', length: 255 })
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

  @ManyToOne(() => FreeBoard, (freeBoard) => freeBoard.freeBoardComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'free_board_id', referencedColumnName: 'id' }])
  freeBoard: FreeBoard;

  @ManyToOne(() => User, (user) => user.freeBoardComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => FreeBoardCommentReaction,
    (freeBoardCommentReaction) => freeBoardCommentReaction.freeBoardComment,
  )
  freeBoardCommentReactions: FreeBoardCommentReaction[];

  @OneToMany(
    () => FreeBoardReplyComment,
    (freeBoardReplyComment) => freeBoardReplyComment.freeBoardComment,
  )
  freeBoardReplyComments: FreeBoardReplyComment[];
}
