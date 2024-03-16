import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FreePost } from '@src/entities/FreePost';
import { PostTag } from '@src/entities/PostTag';
import { User } from '@src/entities/User';

@Entity('free_post_tag_link')
export class FreePostTagLink {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '자유게시글 태그 링크 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '자유게시글 태그 링크 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'free_post_id',
    comment: '자유게시글 고유 ID',
    unsigned: true,
  })
  freePostId: number;

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

  @ManyToOne(() => User, (user) => user.freePostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => FreePost, (freePost) => freePost.freePostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'free_post_id', referencedColumnName: 'id' }])
  freePost: FreePost;

  @ManyToOne(() => PostTag, (postTag) => postTag.freePostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_tag_id', referencedColumnName: 'id' }])
  postTag: PostTag;
}
