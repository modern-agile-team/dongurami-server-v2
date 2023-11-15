import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Students } from './Students';
import { Comments } from './Comments';

@Index('comment_emotions_fk1', ['studentId'], {})
@Index('comment_emotions_fk2', ['commentId'], {})
@Entity('comment_emotions', { schema: 'dongurami_local_db' })
export class CommentEmotions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('int', { name: 'comment_id', unsigned: true })
  commentId: number;

  @ManyToOne(() => Students, (students) => students.commentEmotions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;

  @ManyToOne(() => Comments, (comments) => comments.commentEmotions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'comment_id', referencedColumnName: 'id' }])
  comment: Comments;
}
