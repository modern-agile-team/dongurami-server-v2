import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreePost } from './FreePost';
import { ReactionType } from './ReactionType';
import { User } from './User';

@Entity('free_post_reaction', { schema: 'dongurami_v2' })
export class FreePostReaction {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유 게시글 반응 고유 ID',
    unsigned: true,
  })
  id: number;

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