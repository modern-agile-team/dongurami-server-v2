import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { ClubReview } from '@src/entities/ClubReview';

@Index('FK_4a00334d6a00958f6c1c74c9ff3', ['userId'], {})
@Index('FK_ab802f92a6582ef0802e0a821dd', ['clubId'], {})
@Entity('club_review_history')
export class ClubReviewHistory {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 후기 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 후기 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', { name: 'club_id', comment: '동아리 고유 ID', unsigned: true })
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
  })
  isAnonymous: number;

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

  @ManyToOne(() => ClubReview, (clubReview) => clubReview.clubReviewHistories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_review_id', referencedColumnName: 'id' }])
  clubReview: ClubReview;
}
