import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Students } from './Students.entity';
import { Boards } from './Boards.entity';

@Index('board_emotions_fk1', ['studentId'], {})
@Index('board_emotions_fk2', ['boardId'], {})
@Entity('board_emotions', { schema: 'dongurami_local_db' })
export class BoardEmotions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('int', { name: 'board_id', unsigned: true })
  boardId: number;

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
  @JoinColumn([{ name: 'board_id', referencedColumnName: 'id' }])
  board: Boards;
}
