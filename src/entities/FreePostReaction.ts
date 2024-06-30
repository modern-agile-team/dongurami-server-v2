import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { FreePost } from '@src/entities/FreePost';
import { ReactionType } from '@src/entities/ReactionType';
import { User } from '@src/entities/User';

@Entity('free_post_reaction')
export class FreePostReaction {
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
    name: 'free_post_id',
    comment: '자유 게시글 고유 ID',
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
    (reactionType) => reactionType.freePostReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;

  @ManyToOne(() => User, (user) => user.freePostReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => FreePost, (freePost) => freePost.freePostReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'free_post_id', referencedColumnName: 'id' }])
  freePost: FreePost;
}
