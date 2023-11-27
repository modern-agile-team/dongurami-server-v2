import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentEmotions } from './CommentEmotions.entity';
import { Boards } from './Boards.entity';
import { Students } from './Students.entity';
import { ReplyCommentEmotions } from './ReplyCommentEmotions.entity';

@Index('comments_fk1', ['boardId'], {})
@Index('comments_fk2', ['studentId'], {})
@Entity('comments', { schema: 'dongurami_local_db' })
export class Comments {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'board_id', unsigned: true })
  boardId: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('varchar', { name: 'description', length: 255 })
  description: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('tinyint', { name: 'depth', width: 1, default: () => "'0'" })
  depth: boolean;

  @Column('int', { name: 'group_id', default: () => "'0'" })
  groupId: number;

  @Column('tinyint', { name: 'reply_flag', width: 1, default: () => "'0'" })
  replyFlag: boolean;

  @Column('tinyint', {
    name: 'writer_hidden_flag',
    width: 1,
    default: () => "'0'",
  })
  writerHiddenFlag: boolean;

  @Column('int', { name: 'emotion_hit', default: () => "'0'" })
  emotionHit: number;

  @OneToMany(
    () => CommentEmotions,
    (commentEmotions) => commentEmotions.comment,
  )
  commentEmotions: CommentEmotions[];

  @ManyToOne(() => Boards, (boards) => boards.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'board_id', referencedColumnName: 'id' }])
  board: Boards;

  @ManyToOne(() => Students, (students) => students.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;

  @OneToMany(
    () => ReplyCommentEmotions,
    (replyCommentEmotions) => replyCommentEmotions.replyComment,
  )
  replyCommentEmotions: ReplyCommentEmotions[];
}
