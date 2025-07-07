import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { ClubApplicationStatus } from '@src/apis/club-applications/constants/club-application.enum';
import { ClubApplicationAnswerItemDto } from '@src/apis/club-applications/dto/club-application-answer-item.dto';
import { CLUB_APPLICATION_ERROR_CODE } from '@src/constants/error/club-application/club-application-error-code.constant';
import { Club } from '@src/entities/Club';
import { ClubApplicationHistory } from '@src/entities/ClubApplicationHistory';
import { User } from '@src/entities/User';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';

@Entity('club_application')
export class ClubApplication {
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
    name: 'user_id',
    comment: '동아리 지원 유저 고유 ID',
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

  @Column('timestamp', {
    name: 'updated_at',
    comment: '수정 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('timestamp', {
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => Club, (club) => club.clubApplications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Club;

  @ManyToOne(() => User, (user) => user.clubApplications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => ClubApplicationHistory,
    (clubApplicationHistory) => clubApplicationHistory.clubApplication,
  )
  clubApplicationHistories: ClubApplicationHistory[];

  isProcessed() {
    return (
      this.status === ClubApplicationStatus.Reject ||
      this.status === ClubApplicationStatus.Accept
    );
  }

  view() {
    if (this.status !== ClubApplicationStatus.Submit) {
      return;
    }

    this.status = ClubApplicationStatus.Viewed;
  }

  accept() {
    if (this.isProcessed()) {
      throw new HttpBadRequestException({
        code: CLUB_APPLICATION_ERROR_CODE.PROCESSED_APPLICATION,
      });
    }

    this.status = ClubApplicationStatus.Accept;
  }

  reject() {
    if (this.isProcessed()) {
      throw new HttpBadRequestException({
        code: CLUB_APPLICATION_ERROR_CODE.PROCESSED_APPLICATION,
      });
    }

    this.status = ClubApplicationStatus.Reject;
  }
}
