import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Students } from './Students';
import { Boards } from './Boards';

@Index('board_emotions_fk1', ['studentId'], {})
@Index('board_emotions_fk2', ['boardNo'], {})
@Entity('board_emotions', { schema: 'dongurami_local_db' })
export class BoardEmotions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('int', { name: 'board_no', unsigned: true })
  boardNo: number;

  @ManyToOne(() => Students, (students) => students.boardEmotions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;

  @ManyToOne(() => Boards, (boards) => boards.boardEmotions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'board_no', referencedColumnName: 'id' }])
  boardNo2: Boards;
}
