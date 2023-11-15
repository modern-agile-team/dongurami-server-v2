import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Clubs } from './Clubs';
import { Students } from './Students';

@Index('applicants_fk1', ['clubNo'], {})
@Index('applicants_fk2', ['studentId'], {})
@Entity('applicants', { schema: 'dongurami_local_db' })
export class Applicants {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'club_no', unsigned: true })
  clubNo: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('tinyint', { name: 'reading_flag', width: 1, default: () => "'0'" })
  readingFlag: boolean;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Clubs, (clubs) => clubs.applicants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_no', referencedColumnName: 'id' }])
  clubNo2: Clubs;

  @ManyToOne(() => Students, (students) => students.applicants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;
}
