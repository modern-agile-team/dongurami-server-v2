import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { HistoryAction } from '@src/constants/enum';
import { ClubPost } from '@src/entities/ClubPost';
import { PostTag } from '@src/entities/PostTag';

@Index('FK_aa300120c9c17afbe05038bed8b', ['clubId'], {})
@Index('FK_16ddac5d0ad7139092b9df29288', ['userId'], {})
@Entity('club_post_history')
export class ClubPostHistory {
  @Column('bigint', {
    primary: true,
    name: 'id',
    comment: '동아리 게시글 수정이력 고유 ID',
    unsigned: true,
    nullable: false,
  })
  id: string;

  @Column('bigint', {
    name: 'club_id',
    comment: '동아리 고유 ID',
    unsigned: true,
  })
  clubId: string;

  @Column('bigint', {
    name: 'club_post_id',
    comment: '동아리 게시글 고유 ID',
    unsigned: true,
  })
  clubPostId: string;

  @Column('bigint', {
    name: 'user_id',
    comment: '동아리 게시글 수정 유저 고유 ID',
    unsigned: true,
  })
  userId: string;

  @Column('text', { name: 'description', comment: '동아리 게시글 본문' })
  description: string;

  @Column('json', {
    name: 'tags',
    comment: '동아리 게시글 해시태그',
  })
  tags: Pick<PostTag, 'id' | 'userId' | 'name' | 'createdAt'>[];

  @Column('enum', {
    name: 'status',
    comment: '동아리 게시글 상태',
    enum: ['posting', 'remove'],
    default: () => "'posting'",
  })
  status: ClubPostStatus;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('enum', {
    name: 'action',
    comment: 'history를 쌓는 action',
    enum: ['insert', 'update', 'delete'],
  })
  action: HistoryAction;

  @ManyToOne(() => ClubPost, (clubPost) => clubPost.clubPostHistories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_post_id', referencedColumnName: 'id' }])
  clubPost: ClubPost;
}
