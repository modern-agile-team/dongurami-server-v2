import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { Club } from '@src/entities/Club';
import { ClubPostHistory } from '@src/entities/ClubPostHistory';
import { ClubPostTagLink } from '@src/entities/ClubPostTagLink';
import { PostTag } from '@src/entities/PostTag';
import { User } from '@src/entities/User';

@Entity('club_post')
export class ClubPost {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '동아리 게시글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'club_id',
    comment: '동아리 고유 ID',
    unsigned: true,
  })
  clubId: number;

  @Column('int', {
    name: 'user_id',
    comment: '동아리 게시글 생성 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

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

  @Column('timestamp', {
    name: 'updated_at',
    comment: '수정 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('timestamp', {
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.clubPosts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Club, (club) => club.clubPosts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'club_id', referencedColumnName: 'id' }])
  club: Club;

  @OneToMany(
    () => ClubPostHistory,
    (clubPostHistory) => clubPostHistory.clubPost,
  )
  clubPostHistories: ClubPostHistory[];

  @OneToMany(
    () => ClubPostTagLink,
    (clubPostTagLink) => clubPostTagLink.clubPost,
  )
  clubPostTagLinks: ClubPostTagLink[];
}
