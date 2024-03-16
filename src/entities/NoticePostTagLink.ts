import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NoticePost } from '@src/entities/NoticePost';
import { PostTag } from '@src/entities/PostTag';
import { User } from '@src/entities/User';

@Entity('notice_post_tag_link')
export class NoticePostTagLink {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '공지게시글 태그 링크 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '공지게시글 태그 링크 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'notice_post_id',
    comment: '공지게시글 고유 ID',
    unsigned: true,
  })
  noticePostId: number;

  @Column('int', {
    name: 'post_tag_id',
    comment: '게시글 태그 고유 ID',
    unsigned: true,
  })
  postTagId: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.noticePostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => NoticePost, (noticePost) => noticePost.noticePostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'notice_post_id', referencedColumnName: 'id' }])
  noticePost: NoticePost;

  @ManyToOne(() => PostTag, (postTag) => postTag.noticePostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_tag_id', referencedColumnName: 'id' }])
  postTag: PostTag;
}
