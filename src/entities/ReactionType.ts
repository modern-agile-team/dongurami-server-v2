import { FreeBoardCommentReaction } from '@src/entities/FreeBoardCommentReaction';
import { FreeBoardReaction } from '@src/entities/FreeBoardReaction';
import { FreeBoardReplyCommentReaction } from '@src/entities/FreeBoardReplyCommentReaction';
import { NoticeBoardCommentReaction } from '@src/entities/NoticeBoardCommentReaction';
import { NoticeBoardReaction } from '@src/entities/NoticeBoardReaction';
import { NoticeBoardReplyCommentReaction } from '@src/entities/NoticeBoardReplyCommentReaction';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(
    () => NoticeBoardCommentReaction,
    (noticeBoardCommentReaction) => noticeBoardCommentReaction.reactionType,
  )
  noticeBoardCommentReactions: NoticeBoardCommentReaction[];

  @OneToMany(
    () => NoticeBoardReaction,
    (noticeBoardReaction) => noticeBoardReaction.reactionType,
  )
  noticeBoardReactions: NoticeBoardReaction[];

  @OneToMany(
    () => NoticeBoardReplyCommentReaction,
    (noticeBoardReplyCommentReaction) =>
      noticeBoardReplyCommentReaction.reactionType,
  )
  noticeBoardReplyCommentReactions: NoticeBoardReplyCommentReaction[];
}
