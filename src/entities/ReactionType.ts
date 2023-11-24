import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FreeBoardCommentReaction } from './FreeBoardCommentReaction';
import { FreeBoardReaction } from './FreeBoardReaction';
import { FreeBoardReplyCommentReaction } from './FreeBoardReplyCommentReaction';

@Entity('reaction_type', { schema: 'dongurami_v2' })
export class ReactionType {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '반응 타입 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'name', comment: '반응 타입', length: 30 })
  name: string;

  @Column('varchar', { name: 'memo', comment: '메모', length: 255 })
  memo: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(
    () => FreeBoardCommentReaction,
    (freeBoardCommentReaction) => freeBoardCommentReaction.reactionType,
  )
  freeBoardCommentReactions: FreeBoardCommentReaction[];

  @OneToMany(
    () => FreeBoardReaction,
    (freeBoardReaction) => freeBoardReaction.reactionType,
  )
  freeBoardReactions: FreeBoardReaction[];

  @OneToMany(
    () => FreeBoardReplyCommentReaction,
    (freeBoardReplyCommentReaction) =>
      freeBoardReplyCommentReaction.reactionType,
  )
  freeBoardReplyCommentReactions: FreeBoardReplyCommentReaction[];
}
