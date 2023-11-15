import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Applicants } from './Applicants.entity';
import { Boards } from './Boards.entity';
import { Students } from './Students.entity';
import { Members } from './Members.entity';
import { Questions } from './Questions.entity';
import { Reviews } from './Reviews.entity';
import { Schedules } from './Schedules.entity';
import { Scraps } from './Scraps.entity';

@Index('clubs_fk1', ['leader'], {})
@Entity('clubs', { schema: 'dongurami_local_db' })
export class Clubs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('varchar', { name: 'name', length: 50 })
  name: string;

  @Column('varchar', { name: 'category', length: 20 })
  category: string;

  @Column('text', { name: 'logo_url', nullable: true })
  logoUrl: string | null;

  @Column('float', {
    name: 'avg_score',
    nullable: true,
    precision: 2,
    scale: 1,
  })
  avgScore: number | null;

  @Column('int', { name: 'leader_id', unsigned: true })
  leaderId: number;

  @Column('text', { name: 'introduce', nullable: true })
  introduce: string | null;

  @OneToMany(() => Applicants, (applicants) => applicants.club)
  applicants: Applicants[];

  @OneToMany(() => Boards, (boards) => boards.club)
  boards: Boards[];

  @ManyToOne(() => Students, (students) => students.clubs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'leader_id', referencedColumnName: 'id' }])
  leader: Students;

  @OneToMany(() => Members, (members) => members.club)
  members: Members[];

  @OneToMany(() => Questions, (questions) => questions.club)
  questions: Questions[];

  @OneToMany(() => Reviews, (reviews) => reviews.club)
  reviews: Reviews[];

  @OneToMany(() => Schedules, (schedules) => schedules.club)
  schedules: Schedules[];

  @OneToMany(() => Scraps, (scraps) => scraps.club)
  scraps: Scraps[];
}
