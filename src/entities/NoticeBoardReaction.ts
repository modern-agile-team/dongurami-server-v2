import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeBoard } from './NoticeBoard';
import { ReactionType } from './ReactionType';
import { User } from './User';

@Entity('notice_board_reaction', { schema: 'dongurami_local_db' })
export class NoticeBoardReaction {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 반응 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.noticeBoardReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => NoticeBoard,
    (noticeBoard) => noticeBoard.noticeBoardReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'notice_board_id', referencedColumnName: 'id' }])
  noticeBoard: NoticeBoard;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.noticeBoardReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;
}
