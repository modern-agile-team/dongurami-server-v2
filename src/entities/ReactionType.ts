import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FreePostCommentReaction } from './FreePostCommentReaction';
import { FreePostReaction } from './FreePostReaction';
import { FreePostReplyCommentReaction } from './FreePostReplyCommentReaction';
import { NoticePostCommentReaction } from './NoticePostCommentReaction';
import { NoticePostReaction } from './NoticePostReaction';
import { NoticePostReplyCommentReaction } from './NoticePostReplyCommentReaction';

@Entity('reaction_type')
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
    comment: '수정 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(
    () => FreePostCommentReaction,
    (freePostCommentReaction) => freePostCommentReaction.reactionType,
  )
  freePostCommentReactions: FreePostCommentReaction[];

  @OneToMany(
    () => FreePostReaction,
    (freePostReaction) => freePostReaction.reactionType,
  )
  freePostReactions: FreePostReaction[];

  @OneToMany(
    () => FreePostReplyCommentReaction,
    (freePostReplyCommentReaction) => freePostReplyCommentReaction.reactionType,
  )
  freePostReplyCommentReactions: FreePostReplyCommentReaction[];

  @OneToMany(
    () => NoticePostCommentReaction,
    (noticePostCommentReaction) => noticePostCommentReaction.reactionType,
  )
  noticePostCommentReactions: NoticePostCommentReaction[];

  @OneToMany(
    () => NoticePostReaction,
    (noticePostReaction) => noticePostReaction.reactionType,
  )
  noticePostReactions: NoticePostReaction[];

  @OneToMany(
    () => NoticePostReplyCommentReaction,
    (noticePostReplyCommentReaction) =>
      noticePostReplyCommentReaction.reactionType,
  )
  noticePostReplyCommentReactions: NoticePostReplyCommentReaction[];
}
