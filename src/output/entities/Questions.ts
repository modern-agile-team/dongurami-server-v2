import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answers } from './Answers';
import { Clubs } from './Clubs';

@Index('questions_fk1', ['clubNo'], {})
@Entity('questions', { schema: 'dongurami_local_db' })
export class Questions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'club_no', unsigned: true })
  clubNo: number;

  @Column('varchar', { name: 'description', length: 255 })
  description: string;

  @OneToMany(() => Answers, (answers) => answers.questionNo2)
  answers: Answers[];

  @ManyToOne(() => Clubs, (clubs) => clubs.questions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_no', referencedColumnName: 'id' }])
  clubNo2: Clubs;
}
