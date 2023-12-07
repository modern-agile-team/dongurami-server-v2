import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticePost } from './NoticePost';
import { ReactionType } from './ReactionType';
import { User } from './User';

@Entity('notice_post_reaction', { schema: 'dongurami_local_db' })
export class NoticePostReaction {
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

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.noticePostReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @Column('int', {
    name: 'notice_post_id',
    comment: '공지 게시글 고유 ID',
    unsigned: true,
  })
  noticePostId: number;

  @ManyToOne(() => NoticePost, (noticePost) => noticePost.noticePostReactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'notice_post_id', referencedColumnName: 'id' }])
  noticePost: NoticePost;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.noticePostReactions,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'reaction_type_id', referencedColumnName: 'id' }])
  reactionType: ReactionType;
}
