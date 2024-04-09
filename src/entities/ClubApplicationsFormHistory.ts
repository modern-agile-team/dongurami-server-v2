import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubApplicationsForm } from '@src/entities/ClubApplicationsForm';

@Index('FK_bb889933fee11d659b3ef8fc5dd', ['clubId'], {})
@Entity('club_applications_form_history')
export class ClubApplicationsFormHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 지원서 폼',
    unsigned: true,
  })
  id: number;

  @Column('int', { name: 'club_id', comment: '동아리 고유 ID', unsigned: true })
  clubId: number;

  @Column('json', { name: 'common_question', comment: '공통 질문' })
  commonQuestion: object;

  @Column('json', { name: 'custom_question', comment: '동아리 커스텀 질문' })
  customQuestion: object;

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

  @Column('enum', {
    name: 'action',
    comment: 'history를 쌓는 action',
    enum: ['insert', 'update', 'delete'],
  })
  action: 'insert' | 'update' | 'delete';

  @Column('int', {
    name: 'user_id',
    nullable: true,
    comment: '동아리 지원서 폼 수정 유저',
    unsigned: true,
  })
  userId: number | null;

  @ManyToOne(
    () => ClubApplicationsForm,
    (clubApplicationsForm) =>
      clubApplicationsForm.clubApplicationsFormHistories,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([
    { name: 'club_applications_form_id', referencedColumnName: 'id' },
  ])
  clubApplicationsForm: ClubApplicationsForm;
}
