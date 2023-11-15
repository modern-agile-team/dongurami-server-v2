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

@Index('reply_comment_emotions_fk1', ['studentId'], {})
@Index('reply_comment_emotions_fk2', ['replyCommentId'], {})
@Entity('reply_comment_emotions', { schema: 'dongurami_local_db' })
export class ReplyCommentEmotions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('int', { name: 'reply_comment_id', unsigned: true })
  replyCommentId: number;

  @ManyToOne(() => Students, (students) => students.replyCommentEmotions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;

  @ManyToOne(() => Comments, (comments) => comments.replyCommentEmotions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'reply_comment_id', referencedColumnName: 'id' }])
  replyComment: Comments;
}
