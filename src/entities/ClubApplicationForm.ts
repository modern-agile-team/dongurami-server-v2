import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubApplicationFormQuestionItem } from '@src/apis/club-application-form/types/club-application-form.type';
import { Club } from '@src/entities/Club';
import { ClubApplicationFormHistory } from '@src/entities/ClubApplicationFormHistory';
import { User } from '@src/entities/User';

@Entity('club_application_form')
export class ClubApplicationForm {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 지원서 폼',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'club_id',
    comment: '동아리 고유 ID',
    unsigned: true,
  })
  clubId: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 신청서 폼 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('json', { name: 'common_question', comment: '공통 질문' })
  commonQuestion: ClubApplicationFormQuestionItem[];

  @Column('json', { name: 'custom_question', comment: '동아리 커스텀 질문' })
  customQuestion: ClubApplicationFormQuestionItem[];

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

  @ManyToOne(() => Club, (club) => club.clubApplicationForms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Club;

  @ManyToOne(() => User, (user) => user.clubApplicationForms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => ClubApplicationFormHistory,
    (clubApplicationFormHistory) =>
      clubApplicationFormHistory.clubApplicationForm,
  )
  clubApplicationFormHistories: ClubApplicationFormHistory[];
}
