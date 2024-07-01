import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ClubReview } from '@src/entities/ClubReview';
import { ReactionType } from '@src/entities/ReactionType';
import { User } from '@src/entities/User';

@Entity('club_review_reaction')
export class ClubReviewReaction {
  @Column('bigint', {
    primary: true,
    name: 'id',
    comment: '고유 ID',
    unsigned: true,
    nullable: false,
  })
  id: string;

  @Column('bigint', {
    name: 'reaction_type_id',
    comment: '리액션 타입 고유 ID',
    unsigned: true,
  })
  reactionTypeId: string;

  @Column('bigint', {
    name: 'user_id',
    comment: '유저 고유 ID',
    unsigned: true,
  })
  userId: string;

  @Column('bigint', {
    name: 'club_review_id',
    comment: '동아리 후기 고유 ID',
    unsigned: true,
  })
  parentId: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.clubReviewReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;

  @ManyToOne(() => ClubReview, (clubReview) => clubReview.clubReviewReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_review_id', referencedColumnName: 'id' }])
  clubReview: ClubReview;

  @ManyToOne(() => User, (user) => user.clubReviewReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
