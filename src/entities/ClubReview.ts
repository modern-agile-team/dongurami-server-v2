import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubReviewStatus } from '@src/apis/club-reviews/constants/club-review.enum';
import { Club } from '@src/entities/Club';
import { ClubReviewHistory } from '@src/entities/ClubReviewHistory';
import { User } from '@src/entities/User';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';

@Entity('club_review')
export class ClubReview {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 후기 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 후기 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'club_id',
    comment: '동아리 고유 ID',
    unsigned: true,
  })
  clubId: number;

  @Column('varchar', {
    name: 'description',
    nullable: true,
    comment: '동아리 후기 본문',
    length: 255,
  })
  description: string | null;

  @Column('tinyint', {
    name: 'star_rate',
    comment: '동아리 후기 별점',
    unsigned: true,
  })
  starRate: number;

  @Column('tinyint', {
    name: 'is_anonymous',
    comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
    unsigned: true,
    default: () => "'1'",
    transformer: new BooleanTransformer(true),
  })
  isAnonymous: boolean;

  @Column('enum', {
    name: 'status',
    comment: '동아리 후기 상태',
    enum: ['posting', 'remove'],
    default: () => "'posting'",
  })
  status: ClubReviewStatus;

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

  @ManyToOne(() => User, (user) => user.clubReviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Club, (club) => club.clubReviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Club;

  @OneToMany(
    () => ClubReviewHistory,
    (clubReviewHistory) => clubReviewHistory.clubReview,
  )
  clubReviewHistories: ClubReviewHistory[];
}
