import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Questions } from './Questions';
import { Students } from './Students';

@Index('answers_fk1', ['questionNo'], {})
@Index('answers_fk2', ['studentId'], {})
@Entity('answers', { schema: 'dongurami_local_db' })
export class Answers {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'question_id', unsigned: true })
  questionId: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @ManyToOne(() => Questions, (questions) => questions.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'question_id', referencedColumnName: 'id' }])
  question: Questions;

  @ManyToOne(() => Students, (students) => students.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;
}
