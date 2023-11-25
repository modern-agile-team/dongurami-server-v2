import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeBoardComment } from './NoticeBoardComment';
import { ReactionType } from './ReactionType';
import { User } from './User';

@Entity('notice_board_comment_reaction', { schema: 'dongurami_local_db' })
export class NoticeBoardCommentReaction {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 댓글 반응 고유 ID',
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
    () => NoticeBoardComment,
    (noticeBoardComment) => noticeBoardComment.noticeBoardCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'notice_board_comment_id', referencedColumnName: 'id' }])
  noticeBoardComment: NoticeBoardComment;

  @ManyToOne(() => User, (user) => user.noticeBoardCommentReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.noticeBoardCommentReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;
}
