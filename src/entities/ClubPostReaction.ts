import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ClubPost } from '@src/entities/ClubPost';
import { ReactionType } from '@src/entities/ReactionType';
import { User } from '@src/entities/User';

@Entity('club_post_reaction')
export class ClubPostReaction {
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
    name: 'club_post_id',
    comment: '동아리 게시글 고유 ID',
    unsigned: true,
  })
  parentId: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => ClubPost, (clubPost) => clubPost.clubPostReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_post_id', referencedColumnName: 'id' }])
  clubPost: ClubPost;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.clubPostReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;

  @ManyToOne(() => User, (user) => user.clubPostReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
