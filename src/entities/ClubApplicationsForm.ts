import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Club } from '@src/entities/Club';
import { ClubApplicationsFormHistory } from '@src/entities/ClubApplicationsFormHistory';

/**
 * @todo 동아리 지원서 관련 module 생성 시 소스코드 이동
 */
enum QuestionInputType {
  Text = 'text',
  CheckBox = 'checkBox',
  Radio = 'radio',
  File = 'file',
}

interface Question {
  inputType: QuestionInputType;
  isRequired: boolean;
}

interface CommonQuestion {
  userName: Question;
  studentNumber: Question;
  major: Question;
  grade: Question;
  gender: Question;
  phoneNumber: Question;
}

interface CustomQuestion {
  [key: string]: Question;
}

@Entity('club_applications_form')
export class ClubApplicationsForm {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 지원서 폼',
    unsigned: true,
  })
  id: number;

  @Column('json', { name: 'common_question', comment: '공통 질문' })
  commonQuestion: CommonQuestion;

  @Column('json', { name: 'custom_question', comment: '동아리 커스텀 질문' })
  customQuestion: CustomQuestion;

  @Column('timestamp', {
    name: 'starts_at',
    nullable: true,
    comment: '모집 시작일자',
  })
  startsAt: Date | null;

  @Column('timestamp', {
    name: 'ends_at',
    nullable: true,
    comment: '모집 시작종료일자',
  })
  endsAt: Date | null;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    comment: '수정 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Club, (club) => club.clubApplicationsForms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Club;

  @OneToMany(
    () => ClubApplicationsFormHistory,
    (clubApplicationsFormHistory) =>
      clubApplicationsFormHistory.clubApplicationsForm,
  )
  clubApplicationsFormHistories: ClubApplicationsFormHistory[];
}
