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

@Index('reviews_fk1', ['clubNo'], {})
@Index('reviews_fk2', ['studentId'], {})
@Entity('reviews', { schema: 'dongurami_local_db' })
export class Reviews {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'club_no', unsigned: true })
  clubNo: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  description: string | null;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('tinyint', { name: 'score', width: 1 })
  score: boolean;

  @ManyToOne(() => Clubs, (clubs) => clubs.reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_no', referencedColumnName: 'id' }])
  clubNo2: Clubs;

  @ManyToOne(() => Students, (students) => students.reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;
}
