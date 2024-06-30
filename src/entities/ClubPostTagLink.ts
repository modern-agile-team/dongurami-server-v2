import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ClubPost } from '@src/entities/ClubPost';
import { PostTag } from '@src/entities/PostTag';
import { User } from '@src/entities/User';

@Entity('club_post_tag_link')
export class ClubPostTagLink {
  @Column('bigint', {
    primary: true,
    name: 'id',
    comment: '동아리 게시글 태그 링크 고유 ID',
    unsigned: true,
    nullable: false,
  })
  id: string;

  @Column('bigint', {
    name: 'user_id',
    comment: '동아리 게시글 태그 링크 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: string;

  @Column('bigint', {
    name: 'club_post_id',
    comment: '동아리 게시글 고유 ID',
    unsigned: true,
  })
  clubPostId: string;

  @Column('bigint', {
    name: 'post_tag_id',
    comment: '게시글 태그 고유 ID',
    unsigned: true,
  })
  postTagId: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.clubPostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => ClubPost, (clubPost) => clubPost.clubPostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_post_id', referencedColumnName: 'id' }])
  clubPost: ClubPost;

  @ManyToOne(() => PostTag, (postTag) => postTag.clubPostTagLinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'post_tag_id', referencedColumnName: 'id' }])
  postTag: PostTag;
}
