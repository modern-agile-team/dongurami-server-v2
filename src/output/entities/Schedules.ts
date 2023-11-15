import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Students } from './Students';
import { Clubs } from './Clubs';

@Index('schedules_fk1', ['studentId'], {})
@Index('schedules_fk2', ['clubId'], {})
@Entity('schedules', { schema: 'dongurami_local_db' })
export class Schedules {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'club_id', unsigned: true })
  clubId: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('varchar', { name: 'color_code', length: 20 })
  colorCode: string;

  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('date', { name: 'start_date' })
  startDate: string;

  @Column('date', { name: 'end_date' })
  endDate: string;

  @Column('tinyint', { name: 'important', width: 1, default: () => "'0'" })
  important: boolean;

  @ManyToOne(() => Students, (students) => students.schedules, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;

  @ManyToOne(() => Clubs, (clubs) => clubs.schedules, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Clubs;
}
