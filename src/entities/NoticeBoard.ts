import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeBoardComment } from './NoticeBoardComment';
import { NoticeBoardReaction } from './NoticeBoardReaction';
import { NoticeBoardReplyComment } from './NoticeBoardReplyComment';
import { User } from './User';
import { NoticeBoardHistory } from './NoticeBoardHistory';
import { BooleanTransformer } from './transformers/boolean.transformer';

@Entity('notice_board', { schema: 'dongurami_local_db' })
export class NoticeBoard {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지 게시글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'title', comment: '공지게시글 제목', length: 255 })
  title: string;

  @Column('text', { name: 'description', comment: '공지게시글 내용' })
  description: string;

  @Column('int', {
    name: 'hit',
    comment: '조회수',
    unsigned: true,
    default: () => "'0'",
  })
  hit: number;

  @Column('bool', {
    name: 'allow_comment',
    comment: '댓글 허용 여부 (false: 비활성화, true: 허용)',
    default: () => true,
    transformer: new BooleanTransformer(),
  })
  allowComment: boolean;

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

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.noticeBoards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => NoticeBoardComment,
    (noticeBoardComment) => noticeBoardComment.noticeBoard,
  )
  noticeBoardComments: NoticeBoardComment[];

  @OneToMany(
    () => NoticeBoardReaction,
    (noticeBoardReaction) => noticeBoardReaction.noticeBoard,
  )
  noticeBoardReactions: NoticeBoardReaction[];

  @OneToMany(
    () => NoticeBoardReplyComment,
    (noticeBoardReplyComment) => noticeBoardReplyComment.noticeBoard,
  )
  noticeBoardReplyComments: NoticeBoardReplyComment[];

  @OneToMany(
    () => NoticeBoardHistory,
    (noticeBoardHistories) => noticeBoardHistories.noticeBoard,
  )
  noticeBoardHistories: NoticeBoardHistory[];
}
