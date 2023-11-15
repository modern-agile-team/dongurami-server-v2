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

@Index('scraps_fk1', ['clubNo'], {})
@Index('scraps_fk2', ['studentId'], {})
@Entity('scraps', { schema: 'dongurami_local_db' })
export class Scraps {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('int', { name: 'club_no', unsigned: true })
  clubNo: number;

  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('mediumtext', { name: 'scrap_description', nullable: true })
  scrapDescription: string | null;

  @Column('mediumtext', { name: 'board_description' })
  boardDescription: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('varchar', { name: 'file_url', nullable: true, length: 255 })
  fileUrl: string | null;

  @ManyToOne(() => Clubs, (clubs) => clubs.scraps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_no', referencedColumnName: 'id' }])
  clubNo2: Clubs;

  @ManyToOne(() => Students, (students) => students.scraps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;
}
