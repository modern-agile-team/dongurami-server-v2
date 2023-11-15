import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Applicants } from './Applicants';
import { Boards } from './Boards';
import { Students } from './Students';
import { Members } from './Members';
import { Questions } from './Questions';
import { Reviews } from './Reviews';
import { Schedules } from './Schedules';
import { Scraps } from './Scraps';

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

  @Column('int', { name: 'leader', unsigned: true })
  leaderId: number;

  @Column('text', { name: 'introduce', nullable: true })
  introduce: string | null;

  @OneToMany(() => Applicants, (applicants) => applicants.clubNo)
  applicants: Applicants[];

  @OneToMany(() => Boards, (boards) => boards.clubNo)
  boards: Boards[];

  @ManyToOne(() => Students, (students) => students.clubs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'leader', referencedColumnName: 'id' }])
  leader: Students;

  @OneToMany(() => Members, (members) => members.clubNo2)
  members: Members[];

  @OneToMany(() => Questions, (questions) => questions.clubNo2)
  questions: Questions[];

  @OneToMany(() => Reviews, (reviews) => reviews.clubNo2)
  reviews: Reviews[];

  @OneToMany(() => Schedules, (schedules) => schedules.clubNo2)
  schedules: Schedules[];

  @OneToMany(() => Scraps, (scraps) => scraps.clubNo2)
  scraps: Scraps[];
}
