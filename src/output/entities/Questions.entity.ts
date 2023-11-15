import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answers } from './Answers.entity';
import { Clubs } from './Clubs.entity';

@Index('questions_fk1', ['clubId'], {})
@Entity('questions', { schema: 'dongurami_local_db' })
export class Questions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', { name: 'club_id', unsigned: true })
  clubId: number;

  @Column('varchar', { name: 'description', length: 255 })
  description: string;

  @OneToMany(() => Answers, (answers) => answers.question)
  answers: Answers[];

  @ManyToOne(() => Clubs, (clubs) => clubs.questions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Clubs;
}
