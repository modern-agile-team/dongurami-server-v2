import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { ClubApplicationStatus } from '@src/apis/club-applications/constants/club-application.enum';
import { ClubApplicationAnswerItemDto } from '@src/apis/club-applications/dto/club-application-answer-item.dto';
import { HistoryAction } from '@src/constants/enum';
import { ClubApplication } from '@src/entities/ClubApplication';

@Index('FK_6bf6f39f1fe72a7da6414707b0c', ['clubId'], {})
@Index('FK_c3eedbd5ad8c5722a2b6484a96e', ['userId'], {})
@Entity('club_application_history')
export class ClubApplicationHistory {
  @Column('bigint', {
    primary: true,
    name: 'id',
    comment: '동아리 지원서',
    unsigned: true,
    nullable: false,
  })
  id: string;

  @Column('bigint', {
    name: 'club_id',
    comment: '동아리 고유 ID',
    unsigned: true,
  })
  clubId: string;

  @Column('bigint', {
    name: 'club_application_id',
    comment: '동아리 지원서 고유 ID',
    unsigned: true,
  })
  clubApplicationId: string;

  @Column('bigint', {
    name: 'user_id',
    comment: '지원 유저 고유 ID',
    unsigned: true,
  })
  userId: string;

  @Column('json', { name: 'answers', comment: '동아리 지원서 답변' })
  answers: ClubApplicationAnswerItemDto[];

  @Column('enum', {
    name: 'status',
    enum: ['submit', 'viewed', 'accept', 'reject'],
  })
  status: ClubApplicationStatus;

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
  action: HistoryAction;

  @ManyToOne(
    () => ClubApplication,
    (clubApplication) => clubApplication.clubApplicationHistories,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'club_application_id', referencedColumnName: 'id' }])
  clubApplication: ClubApplication;
}
