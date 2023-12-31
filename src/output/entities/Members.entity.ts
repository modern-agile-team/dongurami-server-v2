import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Clubs } from './Clubs.entity';
import { Students } from './Students.entity';

@Index('members_fk1', ['clubId'], {})
@Index('members_fk2', ['studentId'], {})
@Entity('members', { schema: 'dongurami_local_db' })
export class Members {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'student_id', unsigned: true })
  studentId: number;

  @Column('int', { name: 'club_id', unsigned: true })
  clubId: number;

  @Column('tinyint', {
    name: 'join_admin_flag',
    width: 1,
    default: () => "'0'",
  })
  joinAdminFlag: boolean;

  @Column('tinyint', {
    name: 'board_admin_flag',
    width: 1,
    default: () => "'0'",
  })
  boardAdminFlag: boolean;

  @ManyToOne(() => Clubs, (clubs) => clubs.members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Clubs;

  @ManyToOne(() => Students, (students) => students.members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
  student: Students;
}
